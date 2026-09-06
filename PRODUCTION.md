# Tea Road production blueprint

## Target deployment
GitHub Pages remains a static demo only. Production is intended to run as a private backend + PostgreSQL service on a normal server/PaaS, with a custom domain and HTTPS. Existing Railway projects are not part of Tea Road and must not be changed.

## Architecture
- `frontend`: existing React/Vite Tea Road UI.
- `api`: `server/index.js`, REST API, Telegram Mini App auth, users, withdrawals, admin overview and audit log.
- `postgres`: PostgreSQL schema in `server/schema.sql`.
- `blockchain`: provider adapter boundary. Tatum is wired for TRON address generation when `TATUM_API_KEY` and `TATUM_TRON_XPUB` are configured. Mainnet signing must remain inside a secure custody/KMS boundary, never in browser code or ordinary environment logs.
- `admin`: existing React admin console plus production API/RBAC/audit layer.

## Networks
Supported product configuration: USDT on TRC-20, BEP-20 and Polygon. The first provider adapter is TRON/Tatum. BEP-20 and Polygon should be connected through the same provider interface after the chosen custody/KMS provider is configured.

## Security model
1. Telegram ID is the primary application identifier.
2. Transaction Password is a separate 6-digit PIN and is never stored in plaintext.
3. Withdrawals are created as `pending_review` and must pass server-side validation and risk checks.
4. Admin actions are role-scoped and written to `audit_log`.
5. Private keys/mnemonics never belong in frontend code, Git, database plaintext, or logs.
6. Mainnet transfers require a custody/KMS provider and explicit approval workflow.
7. Start with testnet/sandbox before enabling mainnet.

## Production environment
Set secrets only in the hosting provider's secret store:
- `DATABASE_URL`
- `JWT_SECRET`
- `TELEGRAM_BOT_TOKEN`
- `ADMIN_BOOTSTRAP_TOKEN`
- `TATUM_API_KEY`
- `TATUM_TRON_XPUB`
- `DEMO_MODE=false` only after legal/compliance, wallet and monitoring controls are ready.

## Important product boundary
The current UI's VIP rates are product configuration inherited from the Tea Road specification. A real-money launch requires the operator to establish the applicable legal, regulatory, KYC/AML, consumer-disclosure, tax and custody requirements before enabling deposits, investment balances or withdrawals. The code does not itself create a legal authorization to operate a financial product.

## Local
```bash
npm install
npm run dev
npm run api
```

For PostgreSQL:
```bash
psql "$DATABASE_URL" -f server/schema.sql
```

## API health
`GET /health` returns database and blockchain configuration status without exposing secrets.
