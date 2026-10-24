# Adam ENT subscription API

Requires Node.js 24 or newer. Uses built-in HTTP, SQLite and cryptography; no npm dependencies. No payment provider, real card processing or real funds collection is implemented.

## Local demonstration

1. Copy `.env.example` to `.env` locally.
2. Generate an administrative secret with `node cli.mjs admin-token`, and set `ADMIN_TOKEN` in `.env`. Keep it private.
3. Set `PAYMENT_MODE=sandbox` only for a clearly labelled local demonstration. Leave `NODE_ENV=development` and `HOST=127.0.0.1`.
4. Run `node --env-file=.env server.mjs` and visit `http://127.0.0.1:8787/`. The student application is under `/student/`.
5. Run tests from the server directory with `node --test ../tests/server.test.mjs`.

The server creates its own SQLite database and P-256 signing key in `DATA_DIR`. These files contain private data and must never be placed in the website, student bundle, Android APK, or distribution archive. Keep the data directory on persistent encrypted storage; back it up securely. Restrict OS access to the service account. The Windows deployment operator must apply filesystem ACLs; POSIX file modes alone do not enforce Windows ACLs.

## Deployment requirements

Use a trusted HTTPS reverse proxy, `NODE_ENV=production`, an HTTPS `PUBLIC_URL` and `WEBSITE_URL`, a unique `ADMIN_TOKEN` of at least 32 characters, and a persistent absolute `DATA_DIR`. Set `HOST=127.0.0.1`, firewall the Node port from Internet access, and expose only the HTTPS reverse proxy. Configure the proxy's maximum request size and rate limits.

Forwarded IP headers are ignored by default. When nginx runs on the same machine, set `TRUST_PROXY_IPS=127.0.0.1` so each student's rate limits use their actual IP rather than sharing the proxy's quota. This is an exact physical peer IP allowlist, without CIDR ranges, hostnames or wildcard entries. Only one valid `X-Real-IP` from an allowlisted peer is accepted; invalid, duplicate or multi-valued headers fall back to the socket address. `X-Forwarded-For` is always ignored. Never enable this setting unless the proxy **overwrites** the incoming header with its own observed address. Within the HTTPS nginx server's location, use:

```nginx
location / {
    proxy_pass http://127.0.0.1:8787;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

The overwrite and loopback binding are required: accepting an Internet client's own `X-Real-IP` would let them evade rate limits. Add appropriate edge rate limits as well. For a remote proxy, use a private network with ACLs allowing only that proxy to reach the Node port, and allowlist its exact physical connection IP instead.

Set `CORS_ORIGINS` to exact controlled frontend origins separated by commas. Add `https://appassets.androidplatform.net` for the packaged Android WebView. No wildcard or cookie authentication is used. The browser's bearer session is bound to `X-Device-Id` and the server also verifies the active device and session on each authenticated request. Set Android's production `config.js` with your HTTPS API origin and the correct pinned public JWK. The hosted server generates `/student/config.js` with its public key for same-origin testing; it never serves the private key. Preserve signing keys across deployments. A key rotation requires coordinating a client public-key update.

Production always disables sandbox purchase confirmation, including if `PAYMENT_MODE=sandbox` was set accidentally. Order creation returns `503 payment_not_configured` until a real, audited provider integration is written. Such an integration needs authenticated provider callbacks, signature validation, transaction reconciliation, refunds/revocation handling, and server-side amount/currency verification; redirect parameters and client assertions cannot activate subscriptions. Purchases occur on the website, not in the Google Play consumption app.

Prices are fixed server-side: IQD 15,000 for three calendar months and IQD 50,000 for twelve calendar months. Renewals extend an active entitlement from its existing expiry; expired subscriptions restart at server time. Month ends clamp to the last day of the destination month. Sandbox confirmation is owner-only and idempotent. Pending and failed orders never grant access.

## Support and privacy

`node cli.mjs reset-password user@example.com` reads a hidden password interactively, or from standard input when piped; the password is never accepted in command arguments. Reset invalidates every session. Verify the account owner's identity through your support process before using it. No email provider or pretend email delivery is included. A password reset cannot instantly invalidate a previously issued offline license.

If a student has lost access to both registered devices or cleared their browser data, verify their identity and run `node cli.mjs reset-devices user@example.com`. This revokes all active device registrations and all online sessions, freeing the two device slots. The student can then log in with their existing password on a replacement device. It preserves their paid entitlement, orders and local study progress; it does not recover progress from a lost device. Previously issued offline licenses can remain valid for up to seven days, bounded by subscription expiry, until the device reconnects or the license expires.

The authenticated `DELETE /api/account` route requires the current password and deletes the account, devices, sessions, orders and entitlement from this application's SQLite database. For a live provider, implement the legally required payment/audit retention and provider-side deletion process before launch. The app must clear its local account content after deletion. A disconnected device can retain access only until its existing signed license expires (maximum seven days). Account deletion, device removal and administrative revocation are enforced on the next online request; immediate remote erasure of an offline device is impossible.

Offline licenses are ES256 compact JWS tokens using IEEE-P1363 signatures, limited to the shorter of seven days and the subscription expiry. Progress is stored locally by the client and is not uploaded to this server. Offline content and client-side clocks cannot provide tamper-proof DRM on a modified device; a native secure store and platform integrity service are future deployment work.

Static files are served exclusively from the sibling `website/` and `student/` roots. Runtime data, `.env`, private keys and server source are not public routes. Security headers preserve legacy inline scripts/styles required by the existing student application. Tightening that CSP further requires refactoring its existing inline handlers.

## Programmatic tests

`await createServer({dataDir, env, now, adminToken, bankService})` returns a standard `http.Server`; call `.listen()` and `.close()` as usual. Test clocks use epoch seconds. `server.context` exposes the local database and public signing context for tests, never over HTTP.
