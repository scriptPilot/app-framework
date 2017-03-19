# App Framework - Documentation

> First contact with App Framework? Please read our [Readme file](README.md) first!

**Table of contents**

- [Requirements](#requirements)
- [Project folder structure](#project-folder-structure)
- [Configuration options](#configuration-options)
- [CLI commands](#cli-commands)
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

Essentiell:

- [Node.js and npm](https://docs.npmjs.com/getting-started/what-is-npm) for command line interface handling
- [Framework7](https://framework7.io/docs/) and [Framework7-Vue](https://framework7.io/vue/) to develop with HTML and JavaScript

Optional:

- [Vue.js](https://vuejs.org/v2/guide/) to make your application state-based and reactive
- [Firebase services](https://firebase.google.com/docs/web/setup) as free and reliable backend service provider
- [Cordova/PhoneGap](https://cordova.apache.org/docs/en/latest/) to use device hardware API plugins

## Project folder structure

The following project folder will be created by default.

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

Configure your application easily in the `app/config.js` file.

<!-- config-options -->
Option | Allowed | Default
:--- |:--- |:---
title | *string* | My App
defaultLanguage | /^([a-z]{2})$/ | en
theme | ios, material | ios
loadIconFonts | *object* |
&nbsp;&nbsp;&nbsp;framework7 | *boolean* | false
&nbsp;&nbsp;&nbsp;material | *boolean* | false
&nbsp;&nbsp;&nbsp;ion | *boolean* | false
&nbsp;&nbsp;&nbsp;fontawesome | *boolean* | false
iconBackgroundColor | /^#([0-9a-f]{6})$/i | #ffffff
statusbarTextColor | black, white | white
showPhoneFrameOnDesktop | *boolean* | true
materialSubnavbarFix | *boolean* | true
specialRoutes | *object* | {}
pagesWithRequiredLogin | *array* | []
firebase | *object* |
&nbsp;&nbsp;&nbsp;apiKey | *string* | 
&nbsp;&nbsp;&nbsp;authDomain | *string* | 
&nbsp;&nbsp;&nbsp;databaseURL | *string* | 
&nbsp;&nbsp;&nbsp;storageBucket | *string* | 
&nbsp;&nbsp;&nbsp;allowUserRegistration | *boolean* | false
dev-firebase | *object* |
&nbsp;&nbsp;&nbsp;apiKey | *string* | 
&nbsp;&nbsp;&nbsp;authDomain | *string* | 
&nbsp;&nbsp;&nbsp;databaseURL | *string* | 
&nbsp;&nbsp;&nbsp;storageBucket | *string* | 
&nbsp;&nbsp;&nbsp;allowUserRegistration | *boolean* | false
&nbsp;&nbsp;&nbsp;useDevFirebaseOnTesting | *boolean* | false
appStoreId | *string* | 
playStoreId | *string* | 
useCordovaPlugins | *array* | ["cordova-plugin-statusbar","cordova-plugin-whitelist"]
resetLocalStorageOnVersionChange | *boolean* | false
buildSourcemaps | *boolean* | false
fixCodeOnTest | *boolean* | true
fixCodeOnBuild | *boolean* | true
devServerPort | /^([0-9]{4})$/ | 8080
<!-- /config-options -->

## CLI commands

![Process](media/cli-commands.png)

This is an overview and reference, please see the Workflow for details.

- Setup
  - `npm install` to install App Framework and setup the project folder
    - `npm run reset-app` to replace the app folder with minimum files 
  - `npm update` to update App Framework to the latest sub version

- Testing
  - `npm run dev` to start the development server in the web browser
    - `CTRL + C` to stop the development server
  - `npm run ios` to open Xcode with an iOS development build
  - `npm run android` to open Android Studio with a development build

- Building
  - `npm run patch` to build after bug-fixes and improvements
  - `npm run minor` to build after adding new functionality
  - `npm run major` to build after backward-capability breaking changes

- Deployment
  - `npm run firebase` to deploy rules and static files to Firebase
    - `npm run database` to deploy database rules to Firebase
    - `npm run storage` to deploy storage rules to Firebase
    - `npm run hosting` to deploy static files to Firebase
  - `npm run ftp` to deploy static files to your FTP server
  - `npm run xcode` to deploy static files as iOS Xcode project
  - `npm run studio` to deploy static files as Android Studio project  

- Backup
  - `npm run backup` to create a snapshot of the Firebase database and user list
  - `npm run snapshot` to create a snapshot of your project folder

## Vue hooks

These hooks you can use in your app and page components.

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

Right after the installation, you can run `npm run reset-app` to reduce the *app* folder to a minium set of files. Use this if you know Framework7 / Framework7-Vue well and could start with an empty app folder. However, a snapshot will be created before the reset automatically to to *snapshots* folder.

Run `npm update` to update App Framework to latest sub version. A snapshot of your project folder will be created before in folder *snapshots*.

### Design your application
- Use our printable [smartphone template](design/smartphone-template.pdf) to sketch your application
- Use our icon template as [PDF to sketch](design/icon-template.pdf) and [PPTX to draw](design/icon-template.pptx) your application icon

### Develop your application

- Update the configuration in *app/config.json* file - first of all for Firebase!
- Run `npm run dev` to start the development server at localhost:8080
- Save images to *app/images* folder
- Edit the app component in *app/app.vue* file
- Edit page components in *app/pages* folder
  - After adding, removing or renaming pages you have to run `npm run dev` again!
  - Study the code of the Demo App pages to learn how to realize things in App Framework
- Edit your [database rules](https://firebase.google.com/docs/database/security/quickstart) in *app/database-rules.json* file
- Edit your [storage rules](https://firebase.google.com/docs/storage/security/) in *app/storage-rules.txt* file
- Add Cordova / PhoneGap plugins easily in the *config.json* file with property *useCordovaPlugins*

### Test your application

App Framework fix your code automatically on each test or build command. To disable this behavior, you can set the config parameter *fixCodeOnBuild* to false. If some findings could not be fixed automatically, they will be logged to *code-findings.log*.

If *dev-firebase* is configured in *config.json* file, on each test command, the Firebase database and storage rules are deployed automatically.

### Build your application

- Run `npm run patch` after bugfixes and improvements
- Run `npm run minor` after adding new functionality
- Run `npm run major` after breaking backward-capability

### Deploy your application

*App Framework* does many adjustments in the background to enable you to deploy your App easily as Web App or as native App. So you could start fast and become professional later on without any change. But what are the differences?

| &nbsp; |Web App|Native App|
|---|---|---|
|Installation|Are running in the device browser and could be pinned to the homescreen.|Are installed from an App Store or manually to the device (Android only).|
|Performance|Reload on reopen, but could be cached for offline usage. Offline warning.|Kept in runtime of the device, smoother usage. No offline warning.|
|Capability|Only browser features.|Access to the device hardware and OS features.|
|Deployment|In seconds.|Additional native build plus approval process, which takes some time and could be refused at the Apple App Store.|
|Costs|Firebase hosting service is free for small apps.|Apple requires developer program (around 99€ per year), Google Play store requires registration fee (around 25 USD once). For selling apps, Apple and Google charge around 30% of the sales.|
|Promotion|All regular ways.|All regular ways plus special promotions and user ratings in the store.|

Deployment to a FTP server (Web App)

- Run `npm run ftp` to deploy your latest build to your FTP server, on first call, the config file *ftp-config.json* is created automatically and you have to update it with your FTP server data
- For rollback, run `npm run ftp -- --version x.y.z`

Deployment to [Firebase Hosting](https://firebase.google.com/docs/hosting/) (Web App)

- Run `npm run firebase` to deploy your latest build, database rules and storage rules to Firebase
- Run `npm run database` to deploy your latest build database rules to Firebase
- Run `npm run storage` to deploy your latest build storage rules to Firebase
- Run `npm run hosting` to deploy your latest build static files to Firebase
- For rollback, run all the commands above and extend with ' -- --version x.y.z'

Deployment to the Apple App Store (native App)

- You need a Mac with [macOS](http://www.apple.com/de/macos/) and installed [Xcode](https://developer.apple.com/xcode/) (free)
- You need to sign to the [Apple developer program](https://developer.apple.com/programs/) (around 99€ per year)
- You need to prepare the publishing in [iTunes Connect](https://itunesconnect.apple.com/)
- Run `npm run xcode` to create a project file for Xcode, based on [Cordova](https://cordova.apache.org/)
- Make screenshots on the biggest iPhone (you will need them in iTunes Connect later on)
- Create an archive of the Xcode project and upload it within Xcode to iTunes Connect
- Send your App in iTunes Connect for the review to Apple
- For rollback, run `npm run xcode -- --version x.y.z`

Deployment to the Google Play Store (native App)

- You need to install the [Android Studio](https://developer.android.com/studio/)
- You need to register at the [Google Play Developer Console](https://play.google.com/apps/publish/signup/) (around 25 USD once)
- Run `npm run studio` to create a project file for Android Studio, based on [Cordova](https://cordova.apache.org/)
- Select your project and confirm Gradle sync
- Make screenshots, you will need them later in the Google Play Developer Console
- Generate signed APK
- Log in to the Google Play Developer console to deploy your application
- For rollback, run `npm run studio -- --version x.y.z`

### Backup your application

- Run `npm run backup` to save the Firebase database content and user list as JSON to the *snapshots* folder
- Run `npm run snapshot` to create a snapshot of all important project files to the *snapshots* folder
- Backup your project folder frequently by
 - Copying the *snapshots* folder to any external drive or cloud
 - *and/or* Pushing and synchronizing your changes to GitHub
