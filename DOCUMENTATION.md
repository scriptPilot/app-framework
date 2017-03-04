Option | Allowed | Default
:--- |:--- |:---
title | *string* | Demo App
defaultLanguage | /^([a-z]{2})$/ | en
theme | ios, material | ios
test | *object* |
&nbsp;&nbsp;&nbsp;subtest | *object* |
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;subsubtest | *object* |
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;item | *object* | {}
loadIconFonts | *object* |
&nbsp;&nbsp;&nbsp;framework7 | *boolean* | false
&nbsp;&nbsp;&nbsp;material | *boolean* | false
&nbsp;&nbsp;&nbsp;ion | *boolean* | false
&nbsp;&nbsp;&nbsp;fontawesome | *boolean* | true
iconBackgroundColor | /^#([0-9a-f]{6})$/i | #ffffff
statusbarTextColor | black, white | white
showPhoneFrameOnDesktop | *boolean* | true
materialSubnavbarFix | *boolean* | true
specialRoutes | *object* | {"flexible-routing/blog/:blogId/post/:postId":"flexible-routing"}
pagesWithRequiredLogin | *array* | ["firebase-private"]
firebase | *object* |
&nbsp;&nbsp;&nbsp;apiKey | *string* | AIzaSyAvzTiqd9fKR-h47Uxl4iXwqSMU1VjGdII
&nbsp;&nbsp;&nbsp;authDomain | *string* | app-framework-9045a.firebaseapp.com
&nbsp;&nbsp;&nbsp;databaseURL | *string* | https://app-framework-9045a.firebaseio.com
&nbsp;&nbsp;&nbsp;storageBucket | *string* | app-framework-9045a.appspot.com
&nbsp;&nbsp;&nbsp;allowUserRegistration | *boolean* | true
appStoreId | *string* | de.scriptpilot.app-framework
playStoreId | *string* | de.scriptpilot.appframework
useCordovaPlugins | *array* | ["cordova-plugin-statusbar"]
resetLocalStorageOnVersionChange | *boolean* | false
buildSourcemaps | *boolean* | false
fixCodeOnBuild | *boolean* | true
