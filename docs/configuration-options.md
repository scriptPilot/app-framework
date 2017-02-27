# App Framework - Project folder structure

<!-- comment -->
<!-- /comment -->

> First contact with App Framework? Please read the [Readme file](../README.md) first!

Option                           | Allowed values      | Example value
:------------------------------- |:------------------- |:-------------------------------------------- |
title                            | string              | Demo App
theme                            | *ios* or *material* | ios
iconBackgroundColor              | string              | #ffffff
statusbarTextColor               | *white* or *black*  | white
materialSubnavbarFix             | boolean             | true
defaultLanguage                  | string              | en
showPhoneFrameOnDesktop          | boolean             | true
resetLocalStorageOnVersionChange | boolean             | false
specialRoutes                    | object              | {"forum/:postId": "flexible-routing", ...}
pagesWithRequiredLogin           | array               | ["firebase-private", ...]
firebase                         | object              |
firebase.apiKey                  | string              | AIzaSyAvzTiqd9fKR-h47Uxl4iXwqSMU1VjGdII
firebase.authDomain              | string              | app-framework-9045a.firebaseapp.com
firebase.databaseURL             | string              | https://app-framework-9045a.firebaseio.com
firebase.storageBucket           | string              | app-framework-9045a.appspot.com
firebase.messagingSenderId       | string              | 690341427128
firebase.allowUserRegistration   | boolean             | true
loadIconFonts                    | object              |
loadIconFonts.framework7         | boolean             | false,
loadIconFonts.material           | boolean             | false,
loadIconFonts.ion                | boolean             | false,
loadIconFonts.fontawesome        | boolean             | true
appStoreId                       | string              | de.scriptpilot.app-framework
playStoreId                      | string              | de.scriptpilot.appframework
useCordovaPlugins                | array               | ["cordova-plugin-statusbar", ...]
buildSourcemaps                  | boolean             | false
