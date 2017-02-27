# App Framework - Configuration options

<!-- comment -->
<!-- /comment -->

> First contact with App Framework? Please read the [Readme file](../README.md) first!

<!-- update-on-build -->
- `title` *string*
  - Default: "Demo App"
- `defaultLanguage` *string*
  - Pattern: /^([a-z]{2})$/
  - Default: "en"
- `theme` *string*
  - Allowed: ios, material
  - Default: "ios"
- `loadIconFonts` *object*
  - `framework7` *boolean*
    - Default: false
  - `material` *boolean*
    - Default: false
  - `ion` *boolean*
    - Default: false
  - `fontawesome` *boolean*
    - Default: true
- `iconBackgroundColor` *string*
  - Pattern: /^#([0-9a-f]{6})$/i
  - Default: "#ffffff"
- `statusbarTextColor` *string*
  - Allowed: black, white
  - Default: "white"
- `showPhoneFrameOnDesktop` *boolean*
  - Default: true
- `materialSubnavbarFix` *boolean*
  - Default: true
- `specialRoutes` *object*
  - Default: {"flexible-routing/blog/:blogId/post/:postId":"flexible-routing"}
- `pagesWithRequiredLogin` *array*
  - Default: ["firebase-private"]
- `firebase` *object*
  - `apiKey` *string*
    - Default: "AIzaSyAvzTiqd9fKR-h47Uxl4iXwqSMU1VjGdII"
  - `authDomain` *string*
    - Default: "app-framework-9045a.firebaseapp.com"
  - `databaseURL` *string*
    - Default: "https://app-framework-9045a.firebaseio.com"
  - `storageBucket` *string*
    - Default: "app-framework-9045a.appspot.com"
  - `allowUserRegistration` *boolean*
    - Default: true
- `appStoreId` *string*
  - Default: "de.scriptpilot.app-framework"
- `playStoreId` *string*
  - Default: "de.scriptpilot.appframework"
- `useCordovaPlugins` *array*
  - Default: ["cordova-plugin-statusbar"]
- `buildSourcemaps` *boolean*
  - Default: false
- `resetLocalStorageOnVersionChange` *boolean*
  - Default: false
<!-- /update-on-build -->
