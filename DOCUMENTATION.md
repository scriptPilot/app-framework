# App Framework - Documentation

> First contact with App Framework? Please read our [Readme file](README.md) first!

**Table of contents**

- [Requirements](#requirements)
- [CLI commands](#cli-commands)
- [Project folder structure](#project-folder-structure)
- [Configuration options](#configuration-options)
- [Vue hooks](#vue-hooks)
- Workflow
  - [Setup your development environment](#setup-your-development-environment)
  - [Install App Framework](#install-app-framework)
  - [Design your application](#design-your-application)
  - [Develop your application](#develop-your-application)
  - [Test your application](#test-your-application)
  - [Build your application](#build-your-application)
  - [Deploy your application](#deploy-your-application)
  - [Backup your project](#backup-your-application)

Read less, code more - please open a ticket for any open question in our [Issue List](https://github.com/scriptPilot/app-framework/issues).

## Requirements

- Basic knowledge of [Node.js and npm](https://docs.npmjs.com/getting-started/what-is-npm)
- Knowledge of [Framework7](https://framework7.io/docs/) and [Framework7-Vue](https://framework7.io/vue/)

## CLI commands

![Process](media/cli-commands.png)

- Setup
  - `npm install` to install App Framework and setup project folder
  - `npm update` to update App Framework to latest sub version

- Testing
  - `npm run dev` to start development server in web browser
    - `CTRL + C` to stop development server
  - `npm run ios` to open iOS simulator with development snapshot
  - `npm run android` to open Android emulator with development snapshot

- Building
  - `npm run patch` to build after bug-fixes and improvements
  - `npm run minor` to build after adding new functionality
  - `npm run major` to build after backward-capability breaking changes

- Deployment
  - `npm run firebase` to deploy rules and static files to Firebase
    - `npm run database` to deploy database rules to Firebase
    - `npm run storage` to deploy storage rules to Firebase
    - `npm run hosting` to deploy static files to Firebase
  - `npm run ftp` to deploy static files to a FTP server
  - `npm run xcode` to deploy static files as Xcode project
  - `npm run studio` to deploy static files as Android Studio project

  For rollback, add `--version x.y.z` parameter to any deployment command.

## Project folder structure

```
├── app                         # App source folder
│   ├── images                  # App images
│   ├── pages                   # App page components
│   ├── app.vue                 # App main component
│   ├── config.js               # App configuration
│   ├── database-rules.json     # Firebase database rules
│   ├── icon.png                # App icon file (minimum size is 1024 pixel)
│   └── storage-rules.txt       # Firebase storage rules
├── build                       # Latest build files (do not modify)
├── design                      # Design templates (PDF, Power Point)
├── node_modules                # Installed node modules (do not modify)
├── snapshots                   # Project snapshots (for rollback)
├── .babelrc                    # Babel configuration file for ES2015 support
├── .gitignore                  # List of ignored files for Git commits
└── package.json                # Project information
```

## Configuration options

<!-- config-options -->
Option | Allowed | Default
:--- |:--- |:---
title | *string* | Demo App
defaultLanguage | /^([a-z]{2})$/ | en
theme | ios, material | ios
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
<!-- /config-options -->

## Vue hooks

- `$root.title` - App title
- `$root.theme` - Active theme (*ios* or *material*)
- `$root.language` - Active language (*en*, *de*, ...)
- `$root.config` - Object of *config.json*
- `$root.user` - User information (null or object with *uid*, *email*, ...)
- `$root.version` - Project version
- `$root.packageVersion` - Installed App Framework version

## Workflow

### Setup your development environment

You can use your favorite code editor. But we recommend [Atom](https://atom.io/), an open source code editor.

1. Install [Atom](https://atom.io/)
2. Open Atom preferences > Packages page
3. Search for *language-vue-component* and install the package for correct syntax highlighting

### Install App Framework

1. Install [Node.js with npm](https://docs.npmjs.com/getting-started/what-is-npm)
2. Create a **package.json** file in an empty project folder with the following content:

   ```
   {
     "name": "my-app",
     "version": "1.0.0",
     "devDependencies": {
       "app-framework": "*"
     }
   }
   ```

3. Run `npm install` to install App Framework and setup the project folder
4. Run `npm run dev` to start the Demo App at localhost:8080
5. Read our [Documentation](DOCUMENTATION.md)

Run `npm update` to update App Framework to latest sub version. A snapshot of your project folder will be created before in folder *snapshots*.

### Design your application
- Use our printable [smartphone template](design/smartphone-template.pdf) to sketch your application
- Use our icon template as [PDF to sketch](design/icon-template.pdf) and [PPTX to draw](design/icon-template.pptx) your application icon

### Develop your application

- Update the configuration in *app/config.json* file - first of all for Firebase!
- Run `npm run dev` to start development server at localhost:8080
- Save images to *app/images* folder
- Edit app component in *app/app.vue* file
- Edit page components in *app/pages* folder
  - After adding, removing or renaming pages you have to run `npm run dev` again!
  - Study the code of the example pages to learn how to realize things in App Framework
- Edit [database rules](https://firebase.google.com/docs/database/security/quickstart) in *app/database-rules.json* file
- Edit [storage rules](https://firebase.google.com/docs/storage/security/) in *app/storage-rules.txt* file

### Test your application

App Framework fix your code automatically on each test or build command. To disable this behavior, you can set the config parameter *fixCodeOnBuild* to false. If some findings could not be fixed automatically, they will be logged to *code-findings.log*.

### Build your application

- If you use Git, commit your changes first
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

Deployment to a FTP server (Web App)

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
