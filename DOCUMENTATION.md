# App Framework - Documentation

> First contact with App Framework? Please read our [readme file](README.md) first!

- [Requirements](#requirements)
- [ ] [Development environment](#development-environment)
- **Reference**
  - [CLI commands](#cli-commands)
  - [Project folder structure](#project-folder-structure)
  - [Configuration options](#configuration-options)
- [ ] **Workflow**
  - [ ] [Setup your project](#setup-your-project)
  - [ ] [Design your application](#design-your-application)
  - [ ] [Develop your application](#develop-your-application)
    - [ ] [App component](#app-component)
    - [ ] [Page components](#page-components)
    - [Application style](#application-style)
    - [Status bar style](#status-bar-style)
    - [Global data object](#global-data-object)
    - [Firebase backend](#firebase-backend)
    - [ ] [Cordova plugins](#cordova-plugins)
    - [ ] [Import modules](#import-modules)
    - [ ] [State restoration](#state-restoration)
  - [ ] [Test your application](#test-your-application)
  - [ ] [Build your application](#build-your-application)
  - [ ] [Deploy your application](#deploy-your-application)
  - [ ] [Backup your project](#backup-your-project)

> Read less, code more - please open a ticket for any open question in our [issue list](https://github.com/scriptPilot/app-framework/issues).

## Requirements

Before you start to work with *App Framework*, you should be familiar with the following documentation.

Essentiell:

- [Node.js and npm](https://docs.npmjs.com/getting-started/what-is-npm) for command line interface handling
- [Framework7](https://framework7.io/docs/) and [Framework7-Vue](https://framework7.io/vue/) to develop with HTML and JavaScript

Optional:

- [Vue.js](https://vuejs.org/v2/guide/) to make your application state-based and reactive
- [Firebase services](https://firebase.google.com/docs/web/setup) as free and reliable backend service provider
- [Cordova/PhoneGap](https://cordova.apache.org/docs/en/latest/) to use device hardware API plugins
- [iOS design guidelines](https://developer.apple.com/ios/human-interface-guidelines/overview/design-principles/) and [Material design guidelines](https://material.io/guidelines/)

## References

### CLI commands

This is an overview and reference, please see the [Workflow](#workflow) for details.

![Process](media/cli-commands.png)

- Setup
  - `npm install` to install App Framework and setup the project folder
  - `npm update` to update App Framework to the latest sub version

- Testing
  - `npm run dev` to start the development server in the web browser
    - `CTRL + C` to stop the development server
  - `npm run ios` to open the iOS simulator with a development build
  - `npm run android` to open the Android emulator with a development build

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
  - `npm run backup` to create snapshots of the Firebase database and user list
  - `npm run snapshot` to create a snapshot of your project folder

### Project folder structure

The following project folder will be created by default:

```
├── app                         # App source folder
│   ├── images                  # App images
│   ├── pages                   # App page components
│   ├── app.vue                 # App main component
│   ├── config.js               # App configuration
│   ├── database-rules.json     # Firebase database rules
│   ├── icon.png                # App icon file (minimum size is 1024 pixel)
│   ├── routes.json             # App routes configuration
│   └── storage-rules.txt       # Firebase storage rules
├── build                       # Latest build files (do not modify)
├── design                      # Design templates (PDF, Power Point)
├── node_modules                # Installed node modules (do not modify)
├── snapshots                   # Project snapshots (for rollback)
├── .babelrc                    # Babel configuration file for ES2015 support
├── .gitignore                  # List of ignored files for Git commits
└── package.json                # Project information
```

### Configuration options

Configure your application easily in the `config.json` file.

This is an overview and reference, please see the [Workflow](#workflow) for details.

<!-- config-options -->
Option | Allowed | Default
:--- |:--- |:---
title | *string* | My App
language | /^[a-z]{2}$/ | en
theme | ios, material, ios-material, material-ios | material
color | /^[a-z]+$/ | indigo
layout | default, white, dark | default
statusbarVisibility | *boolean* | true
statusbarTextColor | black, white | white
statusbarBackgroundColor | /^#[0-9a-f]{6}$/i | #000000
changeStatusbarBackgroundColorOnThemeColorChange | *boolean* | true
iconBackgroundColor | /^#[0-9a-f]{6}$/i | #ffffff
useIconFonts | *object* |
&nbsp;&nbsp;&nbsp;framework7 | *boolean* | false
&nbsp;&nbsp;&nbsp;material | *boolean* | false
&nbsp;&nbsp;&nbsp;ion | *boolean* | false
&nbsp;&nbsp;&nbsp;fontawesome | *boolean* | false
showPhoneFrameOnDesktop | *boolean* | true
materialSubnavbarFix | *boolean* | true
completeRoutesFile | *boolean* | true
pagesWithRequiredLogin | *array* | []
firebase | *object* |
&nbsp;&nbsp;&nbsp;apiKey | *string* |
&nbsp;&nbsp;&nbsp;authDomain | *string* |
&nbsp;&nbsp;&nbsp;databaseURL | *string* |
&nbsp;&nbsp;&nbsp;storageBucket | *string* |
&nbsp;&nbsp;&nbsp;allowEmailLogin | *boolean* | false
&nbsp;&nbsp;&nbsp;allowEmailRegistration | *boolean* | false
devFirebase | *object* |
&nbsp;&nbsp;&nbsp;deployDevRulesOnTesting | *boolean* | false
&nbsp;&nbsp;&nbsp;apiKey | *string* |
&nbsp;&nbsp;&nbsp;authDomain | *string* |
&nbsp;&nbsp;&nbsp;databaseURL | *string* |
&nbsp;&nbsp;&nbsp;storageBucket | *string* |
&nbsp;&nbsp;&nbsp;allowEmailLogin | *boolean* | false
&nbsp;&nbsp;&nbsp;allowEmailRegistration | *boolean* | false
appStoreId | *string* |
playStoreId | *string* |
useCordovaPlugins | *array* | ["cordova-plugin-statusbar","cordova-plugin-whitelist"]
resetLocalStorageOnVersionChange | *boolean* | false
buildSourcemaps | *boolean* | false
fixCodeOnTest | *boolean* | true
fixCodeOnBuild | *boolean* | true
devServerPort | /^[0-9]{4}$/ | 8080
<!-- /config-options -->

## Workflow

### Setup your project

After you have prepared your [development environment](#development-environment), you could start one or more application projects. Using *App Framework* allows you to start quickly with your next amazing application and have all the recurring and tricky stuff out of the box.

Creating a new application project is easily done in the following three steps:

1. Create a **package.json** file in an empty project folder with the following content:

   ```
   {
     "name": "my-app",
     "version": "1.0.0",
     "devDependencies": {
       "app-framework": "*"
     }
   }
   ```

2. Run `npm install` to install App Framework and setup the project folder
4. Run `npm run dev` to run your application at localhost:8080

If there is a newer version of *App Framework* available at [NPMjs.com](https://www.npmjs.com/), there will be an alert at the development server.

You have to update *App Framework* per application project by running `npm update`.

### Develop your application

#### Application style

You can configure the application style in the *config.json* file:

```
theme: 'material',   // 'ios', 'material', 'ios-material' or 'material-ios'
color: 'indigo',     // Any theme color name
layout: 'default'    // 'default', 'white' or 'dark'
```

You can modify the application style in any Vue hook `created` or later:

```
created: function () {
  this.$root.theme = 'material'
  this.$root.color = 'indigo'
  this.$root.layout = 'default'
}
```

If you want to change the theme in any Vue hook, you need to use `ios-material` or `material-ios` as value in the configuration. With `ios-material`, the default theme will be ios, but you are able to change the theme to `material`, with `material-ios` in the configuration vice versa.

You will reduce the build size if you configure either `ios` or `material`.

Find more information about all theme color and layout options [here](http://framework7.io/docs/color-themes.html).

#### Status bar style

You can configure the application status bar style in the *config.json* file:

```
statusbarVisibility: true,                               // true or false
statusbarTextColor: 'white',                             // 'black' or 'white'
statusbarBackgroundColor: '#3f51b5',                     // Hex color code
changeStatusbarBackgroundColorOnThemeColorChange: true   // true or false
```

You can modify the application status bar style in any Vue hook `created` or later:

```
created: function () {
  this.$root.statusbarVisibility = true
  this.$root.statusbarTextColor = 'white'
  this.$root.statusbarBackgroundColor = '#3f51b5'
}
```

Limitations:

- Changing the status bar visibility is limited to native applications
- Changing the status bar text color is limited to iOS native applications
- Changing the status bar background color is limited to native or homescreen applications

#### Global data object

App Framework provides a global data object for common used data or setting.

The data object will be restored on each application reload and is accessible in any Vue hook `created` or later.

- To save data, use `this.$root.saveData(path, value)`
- To remove data, use `this.$root.removeData(path)`
- To retrieve data, use `this.$root.data.path`

The *path* must be a string, use a a point to nest data. Example:

```
created: function () {
  this.$root.saveData('greeting', 'Hello!')
  this.$root.saveData('names', {first: 'Jan', second: 'Tom', third: 'Sophie'})
  this.$root.removeData('names.second')
}
```

Now, the data object will look like following:

```
{
  greeting: 'Hallo',
  names: {
    first: 'Jan',
    third: 'Sophie'
  }
}
```

Example for the usage in templates:

```
<f7-block>
  <p>UTC date: {{$root.data.dateString}}</p>
  <f7-buttons>
    <f7-button @click="$root.saveData('dateString', (new Date()).toUTCString())">Update date</f7-button>
    <f7-button @click="$root.removeData('dateString')">Remove date</f7-button>
  </f7-buttons>
</f7-block>
```

Do not modify `$root.data` directly, because there wont be any update triggered.

#### Firebase backend

App Framework is well-prepared to use [Firebase](https://firebase.google.com/) as a backend provider.

Configuration file:

```
firebase: {
  apiKey: "AIzaSyAvzTiqd9fKR-h4asdsadsadasd7Uxl4iXwqSMU1VjGdII",   // Leave blank to disable Firebase
  authDomain: "app-framework-9045a.firebaseapp.com",               // Leave blank to disable auth service
  databaseURL: "https://app-framework-9045a.firebaseio.com",       // Leave blank to disable database service
  storageBucket: "app-framework-9045a.appspot.com",                // Leave blank to disable storage service
  allowEmailLogin: true,                                           // true or false
  allowEmailRegistration: true                                     // true or false
}
```

Disabling a service will reduce the build size.

You can use Firebase in any Vue hook `created` or later:

- `window.firebase` - Firebase application instance
- `this.$root.user` or `window.user` -  Shortlink to `window.firebase.auth().currentUser`
- `this.$root.db(...)` or `window.db(...)` - Shortlink to `window.firebase.database().ref(...)`
- `this.$root.store(...)` or `window.store(...)` - Shortlink to `window.firebase.storage().ref(...)`
- `this.$root.timestamp` or `window.timestamp` - Shortlink to `window.database.ServerValue.TIMESTAMP`

To test your Firebase rules in development, you have the chance to configure a devFirebase project:

```
devFirebase: {
  deployDevRulesOnTesting: false,
  apiKey: "AIzaSyBL0Xxsc-jFZ2BnmQV08T4O9B56HJVpwXk",
  authDomain: "dev-app-framework.firebaseapp.com",
  databaseURL: "https://dev-app-framework.firebaseio.com",
  storageBucket: "dev-app-framework.appspot.com",
  allowEmailLogin: true,
  allowEmailRegistration: true
}
```

If you set `deployDevRulesOnTesting: true`, on each test command (`npm run dev`, `npm run ios` and `npm run android`), the *database-rules.json* and *storage-rules.txt* files are deployed to your devFirebase project.
