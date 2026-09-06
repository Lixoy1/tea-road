import express from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
const app = express();
app.use(express.json({ limit: '256kb' }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8080);
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION');
const DEMO_MODE = process.env.DEMO_MODE !== 'false';
const TATUM_API_KEY = process.env.TATUM_API_KEY || '';
const TATUM_BASE = process.env.TATUM_BASE_URL || 'https://api.tatum.io';
const pool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined }) : null;

const PLANS = [
  { id: 1, name: 'Сборщик Чая', amount: 150, dailyRate: 2.5, days: 20 },
  { id: 2, name: 'Мастер Листа', amount: 500, dailyRate: 2.5, days: 25 },
  { id: 3, name: 'Хранитель Улуна', amount: 1000, dailyRate: 2.5, days: 30 },
  { id: 4, name: 'Владыка Пуэра', amount: 2500, dailyRate: 2.5, days: 35 },
  { id: 5, name: 'Чайный Император', amount: 5000, dailyRate: 2.5, days: 40 }
];

function requireDb(res) { if (!pool) { res.status(503).json({ error: 'DATABASE_NOT_CONFIGURED' }); return false; } return true; }
async function signToken(payload) { return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('12h').sign(JWT_SECRET); }
async function auth(req, res, next) { try { const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, ''); if (!token) return res.status(401).json({ error: 'AUTH_REQUIRED' }); const { payload } = await jwtVerify(token, JWT_SECRET); req.user = payload; next(); } catch { res.status(401).json({ error: 'INVALID_TOKEN' }); } }
function admin(req, res, next) { if (!req.user || !['super_admin', 'finance', 'support', 'moderator'].includes(req.user.role)) return res.status(403).json({ error: 'ADMIN_REQUIRED' }); next(); }
function telegramCheck(initData, botToken) { const params = new URLSearchParams(initData); const received = params.get('hash'); if (!received || !botToken) return false; params.delete('hash'); const dataCheckString = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join('\\n'); const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest(); const calculated = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex'); return calculated.length === received.length && crypto.timingSafeEqual(Buffer.from(calculated), Buffer.from(received)); }
async function tatum(pathname, options = {}) { if (!TATUM_API_KEY) throw new Error('TATUM_API_KEY_NOT_CONFIGURED'); const r = await fetch(`${TATUM_BASE}${pathname}`, { ...options, headers: { accept: 'application/json', 'content-type': 'application/json', 'x-api-key': TATUM_API_KEY, ...(options.headers || {}) } }); const text = await r.text(); let body; try { body = JSON.parse(text); } catch { body = { raw: text }; } if (!r.ok) throw new Error(`TATUM_${r.status}`); return body; }

app.get('/health', async (_req, res) => res.json({ ok: true, service: 'tea-road-api', demo: DEMO_MODE, database: Boolean(pool), blockchain: Boolean(TATUM_API_KEY) }));
app.get('/api/plans', (_req, res) => res.json({ plans: PLANS }));

app.post('/api/auth/telegram', async (req, res) => {
  if (!requireDb(res)) return;
  const parsed = z.object({ initData: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'INVALID_INIT_DATA' });
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || !telegramCheck(parsed.data.initData, botToken)) return res.status(401).json({ error: 'TELEGRAM_AUTH_FAILED' });
  const params = new URLSearchParams(parsed.data.initData); const tg = JSON.parse(params.get('user') || '{}'); const telegramId = String(tg.id || '');
  if (!telegramId) return res.status(401).json({ error: 'TELEGRAM_USER_MISSING' });
  const q = await pool.query(`INSERT INTO users (telegram_id, username, display_name) VALUES ($1,$2,$3) ON CONFLICT (telegram_id) DO UPDATE SET username=EXCLUDED.username, display_name=EXCLUDED.display_name, updated_at=now() RETURNING id,telegram_id,username,display_name,role`, [telegramId, tg.username || null, [tg.first_name, tg.last_name].filter(Boolean).join(' ') || tg.username || 'Telegram user']);
  const user = q.rows[0]; const token = await signToken({ sub: String(user.id), telegramId: user.telegram_id, role: user.role }); res.json({ token, user });
});

app.post('/api/auth/admin', async (req, res) => { if (!process.env.ADMIN_BOOTSTRAP_TOKEN || req.body?.token !== process.env.ADMIN_BOOTSTRAP_TOKEN) return res.status(401).json({ error: 'ADMIN_AUTH_FAILED' }); const token = await signToken({ sub: 'admin-bootstrap', role: 'super_admin' }); res.json({ token }); });
app.get('/api/me', auth, async (req, res) => { if (!requireDb(res)) return; const q = await pool.query('SELECT id,telegram_id,username,display_name,role,created_at FROM users WHERE id=$1', [req.user.sub]); if (!q.rowCount) return res.status(404).json({ error: 'USER_NOT_FOUND' }); res.json({ user: q.rows[0] }); });

app.post('/api/deposits/address', auth, async (req, res) => {
  if (!requireDb(res)) return;
  const parsed = z.object({ network: z.enum(['TRC20','BEP20','POLYGON']) }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'INVALID_NETWORK' });
  if (DEMO_MODE && !TATUM_API_KEY) return res.json({ demo: true, network: parsed.data.network, address: 'DEMO_ADDRESS_DISABLED_FOR_REAL_FUNDS' });
  if (!TATUM_API_KEY) return res.status(503).json({ error: 'BLOCKCHAIN_PROVIDER_NOT_CONFIGURED' });
  if (parsed.data.network !== 'TRC20') return res.status(501).json({ error: 'NETWORK_ADAPTER_PENDING', network: parsed.data.network });
  const xpub = process.env.TATUM_TRON_XPUB; if (!xpub) return res.status(503).json({ error: 'TATUM_TRON_XPUB_NOT_CONFIGURED' });
  const idx = await pool.query("SELECT COALESCE(MAX(derivation_index),-1)+1 AS next FROM deposit_addresses WHERE network='TRC20'"); const index = Number(idx.rows[0].next);
  const result = await tatum(`/v3/tron/address/${encodeURIComponent(xpub)}/${index}`);
  const q = await pool.query('INSERT INTO deposit_addresses(user_id,network,address,derivation_index) VALUES($1,$2,$3,$4) ON CONFLICT(user_id,network) DO UPDATE SET address=EXCLUDED.address RETURNING address,network', [req.user.sub, 'TRC20', result.address, index]); res.json({ demo: false, ...q.rows[0] });
});

app.post('/api/withdrawals', auth, async (req, res) => {
  if (!requireDb(res)) return;
  const parsed = z.object({ amount: z.number().positive().max(1000000), network: z.enum(['TRC20','BEP20','POLYGON']), address: z.string().min(20).max(128), pin: z.string().regex(/^\\d{6}$/) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'INVALID_WITHDRAWAL' });
  const userQ = await pool.query('SELECT id,transaction_pin_hash,status FROM users WHERE id=$1', [req.user.sub]); if (!userQ.rowCount || userQ.rows[0].status === 'blocked') return res.status(403).json({ error: 'USER_BLOCKED' });
  const hash = userQ.rows[0].transaction_pin_hash; if (!hash || !(await bcrypt.compare(parsed.data.pin, hash))) return res.status(401).json({ error: 'INVALID_TRANSACTION_PIN' });
  const q = await pool.query('INSERT INTO withdrawals(user_id,amount,network,address,status) VALUES($1,$2,$3,$4,$5) RETURNING id,amount,network,address,status,created_at', [req.user.sub, parsed.data.amount, parsed.data.network, parsed.data.address, 'pending_review']);
  await pool.query('INSERT INTO audit_log(actor_type,actor_id,action,entity_type,entity_id,metadata) VALUES($1,$2,$3,$4,$5,$6)', ['user', req.user.sub, 'withdrawal.created', 'withdrawal', q.rows[0].id, JSON.stringify({ network: parsed.data.network, amount: parsed.data.amount })]); res.status(201).json({ withdrawal: q.rows[0] });
});

app.get('/api/admin/overview', auth, admin, async (_req, res) => { if (!requireDb(res)) return; const [u,w,d,r] = await Promise.all([pool.query('SELECT count(*)::int AS n FROM users'),pool.query("SELECT count(*)::int AS n FROM withdrawals WHERE status='pending_review'"),pool.query("SELECT count(*)::int AS n FROM deposits WHERE status='confirmed'"),pool.query("SELECT count(*)::int AS n FROM risk_alerts WHERE status='open'")]); res.json({ users:u.rows[0].n, pendingWithdrawals:w.rows[0].n, confirmedDeposits:d.rows[0].n, openRiskAlerts:r.rows[0].n }); });
app.get('/api/admin/audit', auth, admin, async (_req, res) => { if (!requireDb(res)) return; const q = await pool.query('SELECT id,actor_type,actor_id,action,entity_type,entity_id,metadata,created_at FROM audit_log ORDER BY created_at DESC LIMIT 200'); res.json({ entries:q.rows }); });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(root, 'dist')));
  app.get('*', (req, res, next) => req.path.startsWith('/api') || req.path === '/health' ? next() : res.sendFile(path.join(root, 'dist', 'index.html')));
}

app.listen(PORT, () => console.log(`Tea Road API listening on :${PORT}`));
