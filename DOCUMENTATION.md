# App Framework - Documentation

> First contact with App Framework? Please read the [Readme file](README.md) first!

**Table of contents**

- [CLI commands](#cli-commands)
- [Project folder structure](#project-folder-structure)
- [Configuration options](#configuration-options)

## CLI commands

**Setup**

- `npm install` to install *App Framework* and setup project folder
- `npm update` to update *App Framework* to latest sub version

**Testing**

- `npm run browser` to start development server with live reload
- `npm run ios` to open iOS simulator
- `npm run android` to open Android emulator

**Building**

- `npm run patch` to build app after bug-fixes and improvements
- `npm run minor` to build app after adding new functionality
- `npm run major` to build app after breaking backward-capability

**Deployment**

- `npm run firebase` to deploy build to Firebase
  - `npm run database` to deploy only database rules to Firebase
  - `npm run storage` to deploy only storage rules to Firebase
  - `npm run hosting` to deploy only static files to Firebase
- `npm run ftp` to deploy build to FTP server
- `npm run xcode` to open build in Xcode
- `npm run studio` to open build in Android Studio

All deployment commands support `--version x.y.z` parameter for rollback.

## Project folder structure

```
.
├── build                       # Latest build files (do not modify)
├── node_modules                # Installed node modules (do not modify)
├── snapshots                   # Project snapshots (for rollback)
├── src                         # App source folder
│   ├── images                  # App images
│   ├── pages                   # App page components
│   ├── app.vue                 # App main component
│   ├── config.js               # App configuration
│   ├── database-rules.json     # Firebase database rules
│   ├── icon.png                # App icon file
│   ├── storage-rules.txt       # Firebase storage rules
└── package.json                # Project information
```

## Configuration options

Option                           | Allowed values      | Example value
:------------------------------- |:------------------- | -------------
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

---

Read less, code more - please open a ticket for any open question in our [Issue List](https://github.com/scriptPilot/app-framework/issues).

### Required knowledge

- [Node.js with npm](https://docs.npmjs.com/getting-started/what-is-npm)
- [Framework7](https://framework7.io/docs/) / [Framework7-Vue](https://framework7.io/vue/)

Optional

- [Vue](https://vuejs.org/v2/guide/)
- [Firebase](https://firebase.google.com/docs/web/setup)

### Setup your development environment

- Install [Node.js with npm](https://docs.npmjs.com/getting-started/what-is-npm)
- Download *[package.json](https://raw.githubusercontent.com/scriptPilot/app-framework/master/demo-app/package.json)* file to an empty folder (keep extension .json!)
- Run `npm install` to setup project folder
- Run `npm update` to update *App Framework* to latest sub version

### Design your application
- Use our printable [smartphone template](smartphone-template.pdf) to sketch your application
- Use our icon template as [PDF to sketch](icon-template.pdf) and [PPTX to draw](icon-template.pptx) your application icon

### Develop your application

- Update the configuration in *package.json* file - first of all for Firebase!
- Run `npm run dev` to start development server at localhost:8080
- Save images to *images* folder
- Edit app component in *app.vue* file
- Edit page components in *pages* folder
  - After adding, removing or renaming pages you have to run `npm run dev` again!
  - Study the code of the example pages to learn how to realize things in App Framework
- Edit [database rules](https://firebase.google.com/docs/database/security/quickstart) in *database-rules.json* file
- Edit [storage rules](https://firebase.google.com/docs/storage/security/) in *storage-rules.txt* file

### Test your application

- Run `npm run check` to check files according [Standard JavaScript](http://standardjs.com/index.html)
- Run `npm run fix` to fix files as far as possible according [Standard JavaScript](http://standardjs.com/index.html)
- Use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) to debug your application

### Build your application

- If you use Git, commit your changes first
- Run `npm run icons` to update favicon, icons and splash screen graphics
- Run `npm run patch` after bugfixes and improvements
- Run `npm run minor` after adding new functionality
- Run `npm run major` after breaking backward-capability

### Deploy your application

*App Framework* does many adjustments in the background to enable you to deploy your App easily as Web App or as native App. So you could start fast and become professional later on without any change. But what are the differences?

||Web App|Native App|
|---|---|---|
|Installation|Are running in the device browser and could be pinned to the homescreen.|Are installed from an App Store or manually to the device (Android only).|
|Performance|Reload on reopen, but could be cached for offline usage. Offline warning.|Kept in runtime of the device, smoother usage. No offline warning.|
|Capability|Only browser features.|Access to the device hardware and OS features.|
|Deployment|In seconds.|Additional native build plus approval process, which takes some time and could be refused at the Apple App Store.|
|Costs|Firebase hosting service is free for small apps.|Apple requires developer program (around 99€ per year), Google Play store requires registration fee (around 25 USD once). For selling apps, Apple and Google charge around 30% of the sales.|
|Promotion|All regular ways.|All regular ways plus special promotions and user ratings in the store.|

Deployment to your own server (Web App)

- Upload the latest *www/build* folder to your server and then the *www/.htaccess* file
- For rollback: Change the version in *www/.htaccess* file to the previous one and upload it to your server

Deployment to [Firebase Hosting](https://firebase.google.com/docs/hosting/) (Web App)

- Run `npm run database` to overwrite the Firebase database rules with the content of *database-rules.json*
- Run `npm run storage` to overwrite the Firebase storage rules with the content of *storage-rules.txt*
- Run `npm run hosting` to push newest build to Firebase Hosting
- For rollback: Change the version in *www/.htaccess* file to the previous one and run `npm run hosting`

Deployment to the Apple App Store (native App)

- You need a Mac with [macOS](http://www.apple.com/de/macos/) and installed [Xcode](https://developer.apple.com/xcode/) (free)
- You need to sign to the [Apple developer program](https://developer.apple.com/programs/) (around 99€ per year)
- You need to prepare the publishing in [iTunes Connect](https://itunesconnect.apple.com/)
- Run `npm run ios` to create a project file for Xcode, based on [Cordova](https://cordova.apache.org/)
- Test your application on several device simulators
- Make screenshots on the biggest iPhone (you will need them in iTunes Connect later on)
- Create an archive of the Xcode project and upload it within Xcode to iTunes Connect
- Send your App in iTunes Connect for the review to Apple

Deployment to the Google Play Store (native App)

- You need to install the [Android Studio](https://developer.android.com/studio/)
- You need to register at the [Google Play Developer Console](https://play.google.com/apps/publish/signup/) (around 25 USD once)
- Run `npm run android` to create a project file for Android Studio, based on [Cordova](https://cordova.apache.org/)
- Select your project, confirm Gradle sync and test your application on several device simulators
- Make screenshots, you will need them later in the Google Play Developer Console
- Generate signed APK
- Log in to the Google Play Developer console to deploy your application

### Backup your application

- Run `npm run backup` to save the Firebase database content to *database-backup.json* file
- Run `npm run zip` to save your project files and latest build to a zip file
- Backup your project folder frequently by
 - Moving the zip file to any external drive or cloud
 - *and/or* Pushing and synchronizing your changes to GitHub
