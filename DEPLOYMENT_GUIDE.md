# Tea Road — production deployment guide

GitHub Pages is only a static/demo environment. Production should run the Docker image with the Node API and PostgreSQL behind HTTPS and a custom domain.

The current backend is intentionally safe by default: `DEMO_MODE=true`.

## Infrastructure
- application container running `node server/index.js`
- managed PostgreSQL
- HTTPS/custom domain
- secret store
- backups and monitoring
- optional Redis for queues/rate limits

## Environment
Set these only in the hosting provider's secret store:
- `DATABASE_URL`
- `JWT_SECRET`
- `TELEGRAM_BOT_TOKEN`
- `ADMIN_BOOTSTRAP_TOKEN`
- `TATUM_API_KEY`
- `TATUM_TRON_XPUB`
- `DEMO_MODE=false` only after production controls are ready

Never put API keys, bot tokens, private keys or seed phrases into frontend code, Git history or logs.

## PostgreSQL
```bash
psql "$DATABASE_URL" -f server/schema.sql
```

The schema covers users, deposit addresses, deposits, withdrawals, VIP positions, harvest events, referrals, risk alerts and audit log.

## Docker
```bash
docker build -t tea-road .
docker run --env-file .env -p 8080:8080 tea-road
curl http://localhost:8080/health
```

## Telegram Mini App
`/api/auth/telegram` validates Telegram WebApp `initData` server-side. Telegram ID is the primary user identifier. The frontend must not trust a Telegram ID submitted as an ordinary form value.

## USDT layer
Product networks are TRC-20, BEP-20 and Polygon. The first adapter is prepared for TRON/Tatum address allocation. The provider boundary allows a custody/KMS provider to be added without rewriting the user-facing application.

For mainnet, signing must stay inside a secure custody/KMS perimeter. Raw private keys must not be stored in the application database.

## Deposit flow
1. User selects network.
2. API allocates/returns a deposit address.
3. Blockchain/indexer detects the transaction.
4. Deposit is stored with tx hash and confirmations.
5. Risk/monitoring checks run.
6. Ledger is credited after the configured confirmation policy.
7. Audit event is written.

## Withdrawal flow
1. User enters destination, network and amount.
2. Server validates address/network/amount.
3. Server verifies the separate 6-digit Transaction PIN hash.
4. Risk engine scores the request.
5. Request enters `pending_review`.
6. Finance approves or rejects.
7. Custody/KMS signs and broadcasts.
8. Confirmation watcher updates status.
9. Audit log records every transition.

The current demo API does not broadcast real withdrawals.

## Admin roles
- **Super Admin** — complete control.
- **Finance** — deposits, withdrawals and financial review.
- **Support** — support/user workflows without financial approval.
- **Moderator** — moderation workflows.

Every privileged operation should create an audit record.

## Anti-fraud baseline
- withdrawal velocity
- repeated failed PIN attempts
- address reuse
- unusual device/session patterns
- referral-loop signals
- blocked account attempts
- rapid deposit/withdrawal behavior

Default suspicious activity to manual review rather than irreversible automatic financial action.

## Mainnet readiness gate
Before enabling real funds, complete legal/regulatory review for the operating jurisdiction, KYC/AML policy and provider, custody/KMS, risk screening, transaction limits, reconciliation, backup/restore testing, monitoring, incident response, privacy/security review and testnet end-to-end testing.

The software itself is not a financial license or authorization to operate.

## Release sequence
`local → staging → testnet → security review → controlled production`

GitHub remains source control only. Production is the Docker application on the chosen host.
