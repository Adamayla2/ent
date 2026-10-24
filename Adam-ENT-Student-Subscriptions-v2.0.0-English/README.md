# Adam ENT Student Subscriptions 2.0.0

An English student application, subscription website, question-bank publishing console, account API, and Android source project. The supplied application and logo are preserved in a separate working copy; the original files are unchanged. An Arabic operator guide is available in `README-AR.md`.

## Included behavior

- Account registration, login, logout, password-confirmed account deletion, and up to two active devices per account.
- Server-priced prepaid plans: **IQD 15,000 for three calendar months**, or **IQD 50,000 for twelve calendar months**. No automatic recurring charge is implemented.
- A separate subscription website. The student application provides account access and content download, without an in-app purchase link or card form.
- Authenticated question-bank downloads with progress, SHA-256 verification, and validated installation.
- Publishing of question JSON or question-only `.entpkg`/ZIP packages with validated PNG, JPEG, or static WebP images.
- Updates merge by stable question UID, preserving existing local IDs, bookmarks, notes, and answer history. Old questions are not automatically removed.
- Separate local content and progress for each account. Logout and subscription expiry preserve progress; cloud progress synchronization is not included.
- Signed offline access for up to seven days after successful verification, capped at subscription expiry. Expiry locks study access without deleting progress. Online revocation takes effect on the next server request; an already-issued offline license may remain valid until its expiry.

## Try the local demonstration

Install **Node.js 24 or later**, extract the complete project, and keep its folders together. The API uses Node's built-in modules and needs no npm packages to run.

In PowerShell, from the project folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\Start-Demo.ps1
```

This execution-policy setting applies only to the launched process. It does not change the system-wide policy. The launcher binds to loopback and stores private demo data under `.local-demo/`.

1. Open `http://127.0.0.1:8787/`, create an account, choose a plan, and use the clearly marked **sandbox checkout**. No card is requested and no money is charged.
2. Open `http://127.0.0.1:8787/admin.html`. Copy the local admin secret from `.local-demo/admin-token.txt` into that page to publish a question bank. Keep this secret private.
3. Open `http://127.0.0.1:8787/student/` with the same account. Download the question bank from the Account screen, then use Study or Exam.

No real question bank is included. Your browser's original IndexedDB contents are separate from the application files. Export your questions from the administrator application and publish the export through the server console. The paid student application receives content through its authenticated downloader.

## Publish and update questions

JSON may be a question array or an object containing `questions`. Each question needs nonempty `questionText`, `optionA`, and `optionB`, plus a single `correctAnswer` from A–E that refers to a nonempty option. `subject`, `chapter`, and `topic` are read directly; missing values become `Uncategorized`, `General`, and `General`.

Keep each question's `uid` stable when making corrections. If absent, a UID is derived from book/source identifiers when available, otherwise from question text and options. Editing text in the latter case changes its identity, so administrator exports with stable UIDs are preferred.

For images, use an administrator question-only `.entpkg` containing `manifest.json`, `database.json`, image files, and checksums. Images are limited to 5 MB and 20 million pixels each, with up to four question images and four explanation images per question. Rename an image when replacing its bytes so saved study sessions keep the original attachment reference. The upload limit is 100 MB and the final downloadable bundle limit is 150 MB.

This release publishes questions and their images. Packages containing lectures, flashcards, or additional book metadata are rejected with an explanation rather than silently dropping that content. Invalid uploads leave the previous published bank intact. Historical published bundles remain in the private data directory; manage storage and backups when hosting.

## Real hosting and payment

**Live payment is not configured.** This project does not process Mastercard or collect real money. Sandbox success is a test outcome, not a financial receipt.

Live service requires an approved merchant account, the chosen provider's API documentation and sandbox/production credentials, and a server integration that verifies authenticated payment callbacks, amount, currency, transaction identity, and reconciliation before granting access. A browser success redirect or receipt image cannot activate a subscription. Production disables sandbox confirmation even if `PAYMENT_MODE=sandbox` was accidentally selected; order creation remains unavailable until a real provider adapter is implemented.

Deploy the API and website behind HTTPS with a persistent private `DATA_DIR`, a strong admin secret, and controlled CORS origins. Follow `server/README.md` and `server/.env.example`. Keep the SQLite database and private license-signing key out of public files, Android bundles, and source archives. Preserve the signing key across deployments; changing it requires coordinating an Android public-key update.

Password recovery currently uses the operator CLI with hidden password input; no email delivery or email-ownership verification is implemented. Support can use `reset-devices` after verifying a student's identity if both device slots are inaccessible. Run these commands with the same `DATA_DIR` as the service. They do not restore progress from a lost device. See `server/README.md` for the exact commands.

The website's external account-deletion URL is `/account-delete.html`. Review owner contact details, privacy and retention policies, public support/deletion URLs, and store declarations before launch.

## Android

See `android/README.md` and `VALIDATION.md` for build instructions and the actual validation status. Configure a deployed HTTPS API origin and matching **public** signing JWK before building a usable app. Allow the exact origin `https://appassets.androidplatform.net` on the API. Keep the sibling `student/` folder with the Android project.

Set the final owner-controlled application ID before the first Play upload and create an owner-managed upload signing key outside the source tree. Physical-device testing, a signed release, Play submission, live hosting, and real payment testing are separate from local browser validation. Existing browser progress does not automatically transfer to a newly installed Android app.

## Verification

```powershell
npm test
npm install
npm run test:browser
```

The browser tests require Chrome and Playwright. They use temporary accounts, banks, and sandbox orders. They do not charge money. See `VALIDATION.md` for the executed results and remaining deployment limits.
