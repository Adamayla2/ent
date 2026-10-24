# Third-party notices

The supplied `student/jszip_min.js` is retained from the user's application. Its header identifies JSZip 3.10.1 and bundled pako. JSZip is used under its MIT option; the presence of the alternative GPL text in the upstream license file does not select that option for this application.

- [JSZip upstream license](https://github.com/Stuk/jszip/blob/v3.10.1/LICENSE.markdown): copied in `licenses/jszip-license.txt`.
- [pako MIT license](https://github.com/nodeca/pako/blob/1.0.11/LICENSE): copied in `licenses/pako-license.txt`.
- The optional Android shell depends on [AndroidX WebKit](https://developer.android.com/jetpack/androidx/releases/webkit), under Apache License 2.0. Its Maven dependency notices remain part of the dependency distribution.
- Build tools are downloaded only from the official Microsoft, Gradle, and Android sources listed in `android/scripts/toolchain-manifest.json`, with checksums. Their SDKs/distributions are not redistributed in this source delivery.
- Playwright is an optional development-only test dependency. It is not included in the student bundle or required to run the server.

These notices do not grant rights to the Adam branding or any publisher's question bank. No real question bank is included.
