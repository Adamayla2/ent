# Adam ENT Android source wrapper

This delivery includes an Android **source project**. Official local build tools were installed and a debug build was attempted, but compilation did not finish: the restricted Windows environment denied Java's canonical-path access to the installed SDK's `android.jar` and `core-for-system-modules.jar`. **No successful APK/AAB build or physical-device test is claimed, and no APK/AAB is delivered.** See `../VALIDATION.md` for the executed checks. No upload key, signing password, private license key, live gateway credentials, or question bank is included.

## Build prerequisites

- Android Studio that supports Android Gradle Plugin 9.4.0, JDK 17, Gradle 9.6.0, Android SDK Platform 36, and Build Tools 36.0.0. `compileSdk`/`targetSdk` are 36; minimum Android is 8.0 (API 26).
- A deployed HTTPS backend, a durable private signing key kept on that backend, a published question bank, and the matching **public** P-256 JWK from `/api/config`.
- Configure backend CORS to allow exactly `https://appassets.androidplatform.net`. This is the local asset origin, not a public server address. Never use wildcard CORS for authenticated API requests.

The versions were checked against official documentation on 2026-10-23: [AGP 9.4.0 compatibility](https://developer.android.com/build/releases/agp-9-4-0-release-notes), [WebKit stable 1.18.0](https://developer.android.com/jetpack/androidx/releases/webkit), and [WebViewAssetLoader](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content). Recheck Play's target API policy when submitting the app.

## Public configuration and build

1. Start and provision the backend first so its public signing JWK exists. Save its public `/api/config` response as `public-server-config.json` outside the Android project. Do not copy server data, private keys, environment files, or sessions into the project.
2. Run PowerShell in this directory:

   ```powershell
   .\prepare-config.ps1 -ApiOrigin 'https://api.your-domain.com' -WebsiteOrigin 'https://your-domain.com' -PublicKeyPath 'C:\path\public-server-config.json'
   ```

   The only generated file is `public-config.json` with the public JWK and HTTPS origins. The build fails until a valid public key is supplied. `-PaymentMode sandbox` is for a test backend only; there is no checkout or gateway link inside the Play app.
3. Open this `android/` directory in Android Studio. Set the Gradle distribution to **9.6.0** and use JDK 17. This source delivery does not contain a downloaded Gradle wrapper JAR/distribution. If Gradle 9.6.0 is installed, generate the official wrapper using `gradle wrapper --gradle-version 9.6.0`, then `./gradlew :app:assembleDebug`. Alternatively, use the workspace-only bootstrap below.
4. The `bundleStudentAssets` Gradle task copies the sibling `../student/` files into generated app assets on every build, excludes its service worker/config, and writes the pinned public configuration. Keep the delivered `student/` folder alongside `android/`.
5. Use Android Studio's signed bundle wizard for the release AAB. Choose the final owner-controlled application ID before the first upload; `iq.adam.ent.student` is a placeholder. Store your upload signing key outside this project and keep a recovery copy.

Do not publish a test/sandbox build as a paid production service. Live payment, hosting, merchant approval, public support/deletion URLs, store account, rights to content, and Play Console declarations require owner configuration before publication. No live payment provider is bundled.

## Optional Windows toolchain bootstrap

`scripts/bootstrap-build.ps1` defaults to printing an offline plan. It never installs globally and only writes tools/caches to `android/.toolchain/`; that directory and generated builds must be excluded from source delivery. It requires PowerShell 7, **Node.js 24 or newer**, and about **6 GiB free disk**. The small `official-fetch.mjs` helper uses Node's standard verified TLS stack, with no certificate bypass or extra dependencies; this also avoids Windows Schannel failures in restricted logon sessions. It limits redirects to five HTTPS hops and checks actual streamed bytes/timeouts. Estimated network transfer is **0.8–1.5 GiB** without an emulator/NDK; Maven dependency sizes vary. Downloads require separately available network access.

```powershell
# Offline: show exact official URLs and pinned checksums, no network or writes.
.\scripts\bootstrap-build.ps1
# Network metadata only: check actual official Maven artifacts and SDK package listings.
.\scripts\bootstrap-build.ps1 -PreflightOnly
# After reviewing/accepting the Android SDK terms and preparing public-config.json:
.\scripts\bootstrap-build.ps1 -BuildDebug -AcceptAndroidLicenses
```

The manifest pins Gradle 9.6.0 (`bbaeb2fef8710818cf0e261201dab964c572f92b942812df0c3620d62a529a01`) and Android command-line tools 15859902 (`90ae805d20434428bffcb699c290860f19bb5f66a67e6b330067e3de801fb04a`) to checksums on their official release pages. Microsoft JDK 17.0.20.1 is a version-specific ZIP with its official SHA-256 sidecar; the script retrieves and checks that checksum before extraction. Archive size/time limits and checksum checks fail closed. Metadata preflight fails if a requested artifact/version cannot be fetched and does not substitute versions automatically. Web documentation availability alone is not evidence that this machine downloaded or built those artifacts.

`-Install -AcceptAndroidLicenses` installs only the local toolchain without building. `-BuildDebug` additionally compiles `app/build/outputs/apk/debug/app-debug.apk` using a generated **debug** keystore in the local toolchain's Android/Java home directories. The script restores process environment variables afterward. A successful debug APK remains a test artifact, not an owner-signed Play release. Keep `.toolchain`, `public-config.json`, caches, keystores, and private backend data out of source ZIPs.

## Runtime behavior

- Student HTML/JS is bundled and loaded by `WebViewAssetLoader` from `https://appassets.androidplatform.net/index.html`. This secure local origin supports IndexedDB/Web Crypto without `file://` access.
- The shell has Internet permission only. It rejects cleartext traffic, invalid TLS certificates, arbitrary remote subresources, file/content access, and unsafe top-level schemes. Only the configured HTTPS API is fetched remotely.
- Navigation within the bundled asset host remains in the WebView. Other HTTPS links open the system browser. No JavaScript/native bridge is exposed. This is a consumption app: account access and bank download happen inside it; purchasing remains on the separate website.
- Service workers are not bundled. The shell itself is available offline; signed leases and downloaded question content are handled by the student client. Accounts/tokens are excluded from Android backups/device transfer.
- Back uses WebView history, then closes the activity at the root. Rotation restores WebView history. Study navigation must use the web app's routing/history implementation.
- Session/device IDs on the website browser and Android WebView are separate; they count toward the server's two-device limit. Existing original app progress is not automatically transferred from a browser installation into a newly installed Android app.

## Required device testing before release

Build and run on a physical device; test registration/login, the two-device limit, paid entitlement restoration, bank download and checksum, account-specific progress, airplane-mode study within the signed lease, expiry during a session, renewal, device revocation, back/rotation, system bars/keyboard, and account deletion. Inspect the release bundle and ensure it contains only public configuration and no question bank or server secrets. A new backend signing key requires a compatible app update; preserve the production key securely.
