# App Framework - Project folder structure

<!-- comment -->
<!-- /comment -->

> First contact with App Framework? Please read the [Readme file](../README.md) first!

<!-- update-on-build -->
Option | Allowed | Default
:--- |:--- |:---
title | *string* | "Demo App"
defaultLanguage | *text*, regex: /^([a-z]{2})$/ | "en"
theme | ios, material | "ios"
loadIconFonts |  | 
loadIconFonts.framework7 | *boolean* | false
loadIconFonts.material | *boolean* | false
loadIconFonts.ion | *boolean* | false
loadIconFonts.fontawesome | *boolean* | true
iconBackgroundColor | *text*, regex: /^#([0-9a-f]{6})$/i | "#ffffff"
statusbarTextColor | black, white | "white"
showPhoneFrameOnDesktop | *boolean* | true
materialSubnavbarFix | *boolean* | true
specialRoutes | *object* | {"flexible-routing/blog/:blogId/post/:postId":"flexible-routing"}
pagesWithRequiredLogin | *array* | ["firebase-private"]
firebase |  | 
firebase.apiKey | *string* | "AIzaSyAvzTiqd9fKR-h47Uxl4iXwqSMU1VjGdII"
firebase.authDomain | *string* | "app-framework-9045a.firebaseapp.com"
firebase.databaseURL | *string* | "https://app-framework-9045a.firebaseio.com"
firebase.storageBucket | *string* | "app-framework-9045a.appspot.com"
firebase.allowUserRegistration | *boolean* | true
appStoreId | *string* | "de.scriptpilot.app-framework"
playStoreId | *string* | "de.scriptpilot.appframework"
useCordovaPlugins | *array* | ["cordova-plugin-statusbar"]
buildSourcemaps | *boolean* | false
resetLocalStorageOnVersionChange | *boolean* | false
<!-- /update-on-build -->
