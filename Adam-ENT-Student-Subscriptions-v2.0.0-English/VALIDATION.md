# Validation record — 24 October 2026

This records executed checks for the English 2.0.0 source delivery. Test accounts, questions, images, and orders were temporary fixtures. No real card transaction, deployment, Play submission, or external account setup was performed.

## Passed

- **53 Node tests**: 25 account/API tests, 20 bank-publishing tests, seven bounded archive/image safety tests, and one client test containing **34 Web Crypto/security assertions**. The client assertions were rerun after English translation and passed.
- **Two real Chrome website tests**, rerun after English translation: registration/login, sandbox pending/failed/paid outcomes, disabled-payment mode, and desktop/mobile layout.
- **38 real Chrome student checks**, rerun after English translation, with no uncaught browser errors. These exercise account registration and reload, unpaid access denial, sandbox entitlement activation, protected JSON and image-package publishing/download, SHA-256 checks, actual IndexedDB installation, study/exam behavior, stable-UID updates preserving progress, signed offline access, forged/expired-license denial, expiry while study is open, clock correction after authenticated verification, renewal, device revocation, isolated account databases, and deletion of one account without deleting another account's data.
- Syntax checks for all 16 non-vendor JavaScript source files. An English-copy audit found only intentional Arabic taxonomy aliases used to interpret imported data; no Arabic interface strings or Arabic date locales remain.
- Visual inspection of the English account and study screenshots. The supplied Adam logo remains unchanged.

Commands:

```powershell
node --test tests/server.test.mjs tests/client.test.mjs tests/bank.test.mjs tests/bank-safety.test.mjs
node --test tests/website.e2e.mjs
node tests/student.e2e.mjs
```

Environment: Node.js 24.22.1, Windows, Chrome, and Playwright 1.62.1. Browser tests intentionally produce denied-request and offline-network outcomes while testing protection; these are expected negative cases.

## Android build attempt

Official Microsoft JDK 17.0.20.1, Gradle 9.6.0, Android command-line tools 15859902, SDK Platform 36, and Build Tools 36.0.0 were downloaded/installed locally. Archive checksums were verified. Android Gradle Plugin 9.4.0 and AndroidX WebKit 1.18.0 dependencies were resolved. The AGP source-set configuration was adjusted to its supported file-path form after an initial configuration failure.

The later build reached `:app:compileDebugJavaWithJavac` and failed with `java.nio.file.AccessDeniedException` when Java resolved the SDK's `android.jar` and `core-for-system-modules.jar` paths. A separate Java path probe reproduced canonical-path denial for a project source file as well. A cached offline build reproduced the SDK error. **Android compilation remains unverified; no successful APK or AAB is delivered.** Build this project in the owner's Android Studio environment and complete physical-device testing before release.

The build attempt used an isolated public test key and reserved `.example` HTTPS addresses, not a deployed service. That configuration, all local tools/caches/builds, and generated debug signing material are excluded from the source ZIP. A usable Android build requires the owner's HTTPS API address and matching public signing JWK.

## Limits before live operation

- Live Mastercard/provider payments are not implemented. Sandbox is visibly labelled and production disables its confirmation endpoint. A selected, approved merchant gateway and authenticated server integration are required.
- No hosting, production bank, owner signing key, merchant secret, or paid user database is included.
- No physical Android device, emulator, signed release, or Play upload was tested.
- Progress is local to each account on each device; no cloud progress sync or automatic migration from the old browser installation is implemented.
- Offline revocation takes effect at the next online check or signed-lease expiry, up to seven days. Client-side access checks are not a promise of tamper-proof DRM on modified devices.
- Password recovery uses operator support; automated email delivery and email-ownership verification are not implemented.

The source delivery is ready for **local browser demonstration and further Android/provider configuration**. It is not a live paid service or a Play-ready release.
