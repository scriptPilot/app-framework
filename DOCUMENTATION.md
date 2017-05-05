# App Framework - Documentation

> First contact with App Framework? Please read our [readme file](README.md) first!

- [x] [Requirements](#requirements)
- [x] [Development environment](#development-environment)
- [ ] **Workflow**
  - [x] [Setup your project](#setup-your-project)
  - [x] [Design your application](#design-your-application)
  - [ ] [Develop your application](#develop-your-application)
    - [x] [Routing](#routing)
    - [ ] [App component](#app-component)
    - [ ] [Page components](#page-components)
    - [x] [Application style](#application-style)
    - [x] [Status bar style](#status-bar-style)
    - [x] [Global data object](#global-data-object)
    - [x] [Firebase backend](#firebase-backend)
    - [ ] [Cordova plugins](#cordova-plugins)
    - [ ] [Import modules](#import-modules)
    - [ ] [Use images](#use-images)
    - [x] [State restoration](#state-restoration)
  - [ ] [Test your application](#test-your-application)
  - [ ] [Build your application](#build-your-application)
  - [ ] [Deploy your application](#deploy-your-application)
  - [ ] [Backup your project](#backup-your-project)
- **Reference**
  - [Project folder structure](#project-folder-structure)
  - [Configuration options](#configuration-options)
  - [CLI commands](#cli-commands)

> Read less, code more - please open a ticket for any open question in our [issue list](https://github.com/scriptPilot/app-framework/issues).

## Requirements

Before you start to work with *App Framework*, you should be familiar with the following documentation.

Essentiell:

- [Node.js and npm](https://docs.npmjs.com/getting-started/what-is-npm) for command line interface handling
- [Framework7](https://framework7.io/docs/) and [Framework7-Vue](https://framework7.io/vue/) to develop with HTML and JavaScript

Optional:

- [Vue.js](https://vuejs.org/v2/guide/) to make your application state-based and reactive
- [Firebase](https://firebase.google.com/docs/web/setup) to use as reliable backend service provider
- [Cordova/PhoneGap](https://cordova.apache.org/docs/en/latest/) to use device hardware API plugins
- [iOS design guidelines](https://developer.apple.com/ios/human-interface-guidelines/overview/design-principles/) and [Material design guidelines](https://material.io/guidelines/)

## Development environment

### Atom

First of all, you need a code editor. We really recommend Atom, which is open source, configurable and available for macOS, Windows and Linux.

1. Download from [Atom.io](https://atom.io/) the right installer for your operating system
2. Install Atom and open it afterwards
3. Select the "Welcome" tab, disable the checkbox *Show welcome guide when opening Atom* and close the tab
4. Select the *Telemetry Consent* tab and decide whether you want to send statistics or not to Atom
5. Open from the top menu *File > Settings* and select in the left menu *Install*
6. Search for package `language-vue-component` and click on *install*
7. Close the settings tab and Atom itself


### Node.js

To run the *App Framework* scripts and the development server, you need to install [Nodejs.org](https://nodejs.org/), which is available for macOS, Windows and Linux and is free of charge. You can install it with the default settings.

### Xcode

[Xcode](https://developer.apple.com/xcode/) is optional. You need it, if you want to publish your application to the Apple App Store. You can install Xcode only to macOS machines, like iMac or macBook. You can download Xcode free of charge from the macOS App Store.

### Android Studio

[Android Studio](https://developer.android.com/studio/index.html) is optional. You need it, if you want to publish your application to the Google Play Store. It is available free of charge for macOS, Windows and Linux.

### GitHub Desktop

GitHub Desktop client is optional. We recommend it as a Git client, because GitHub is great for collaboration or as a backup for your own code. The desktop client is available for macOS and Windows and is free of charge.

1. Create an account on [GitHub.com](https://github.com/join)
2. Download from [GitHub.com](https://desktop.github.com/) the right installer for your operating system
3. Install GitHub Desktop and log in with your credentials
4. Configure your user name and a email address under which your will commit to GitHub
5. Close the GitHub Desktop client

### Reboot

At the end of the installation process, you should reboot your computer.

## Workflow

### Setup your project

After you have prepared your [development environment](#development-environment), you could start one or more application projects. Using *App Framework* allows you to start quickly with your next amazing application and have all the recurring and tricky stuff out of the box.

Creating a new application project is easily done in the following three steps:

1. Create an empty project folder
2. Create a **package.json** file in it with the following content:

   ```
   {
     "name": "my-app",
     "version": "1.0.0",
     "devDependencies": {
       "app-framework": "*"
     }
   }
   ```

3. Run `npm install` to install *App Framework* and setup the project folder

If there is a newer version of *App Framework* available at [NPMjs.com](https://www.npmjs.com/package/app-framework), there will be an alert at the development server.

You have to update *App Framework* per application project by running `npm update`.

### Design your application
- Use our printable [smartphone template](design/smartphone-template.pdf) to sketch your application
- Use our icon template as [PDF to sketch](design/icon-template.pdf) and [PPTX to draw](design/icon-template.pptx) your application icon

### Develop your application

- Update the configuration in *app/config.json* file
- Run `npm run dev` to start the development server at localhost:8080
- Save images to *app/images* folder
- Edit the app component in *app/app.vue* file
- Edit page components in *app/pages* folder
- Edit your [database rules](https://firebase.google.com/docs/database/security/quickstart) in *app/database-rules.json* file
- Edit your [storage rules](https://firebase.google.com/docs/storage/security/) in *app/storage-rules.txt* file
- Add Cordova / PhoneGap plugins easily in the *config.json* file with property *useCordovaPlugins*

#### Routing

*App Framework* completes and checks the *routes.json* file automatically on any test or build command for you. To disable the completion, set `completeRoutesFile: false` in the configuration file.

*App Framework* supports all possibilities for nested routing, described [for Framework7-Vue](http://framework7.io/vue/navigation-router.html).

You have to take care for the following rules when you name your *pages/ ... .vue* files:

- Lowercase and hyphen-type: `your-new-page.vue` (allowed: [0-9a-z-])
- An underscore indicates tab routes: `your-new-page_tab1.vue`
- Two underscores indicates alternate tab routes: `your-new-page_tab1_alternate.vue`

Pages in sub folders *pages/sub-folder/... .vue* are supported. Sub folders do not have any impact to the route structure but let your organize your page components better.

As an example, if you have the following page components:

- *pages/tabs.vue*
- *pages/tabs_tab1.vue*
- *pages/tabs_tab2.vue*
- *pages/tabs_tab2_alternate.vue*
- *pages/tabs_tab3.vue*

*App Framework* generates the following routes:

```
{
  "path": "/tabs/",
  "component": "tabs.vue",
  "tabs": [
    {
      "path": "/tab1/",
      "tabId": "tab1",
      "component": "tabs_tab1.vue"
    },
    {
      "path": "/tab2/",
      "tabId": "tab2",
      "component": "tabs_tab2.vue",
      "routes": [
        {
          "path": "/alternate/",
          "component": "tabs_tab2_alternate.vue"
        }
      ]
    },
    {
      "path": "/tab3/",
      "tabId": "tab3",
      "component": "tabs_tab3.vue"
    }
  ]
}
```

For dynamic routes, you have to add them manually to the *routes.json* file. Example:

```
{
  "path": "/flexible-routing/blog/:blogId/post/:postId/",
  "component": "flexible-routing.vue"
}
```

To protect routes and require user authentication before, just add `login: true` as a property. Example:

```
{
  "path": "/tabs/",
  "component": "tabs.vue",
  "login": true,
  "tabs": [
    {
      "path": "/tab1/",
      "tabId": "tab1",
      "component": "tabs_tab1.vue"
    },
    {
      "path": "/tab2/",
      "tabId": "tab2",
      "component": "tabs_tab2.vue",
      "login": true
    },
    {
      "path": "/tab3/",
      "tabId": "tab3",
      "component": "tabs_tab3.vue"
    }
  ]
}
```

In the example above, */tabs/* and */tabs/tab2/* require login, */tabs/tab1/* and */tabs/tab3/* not.

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
  apiKey: "AIzaSyAvzTiqd9fKR-h47Uxl4iXwqSMU1VjGdII",           // Required for Firebase initialization
  authDomain: "app-framework-9045a.firebaseapp.com",           // Leave blank to disable auth service
  databaseURL: "https://app-framework-9045a.firebaseio.com",   // Leave blank to disable database service
  storageBucket: "app-framework-9045a.appspot.com",            // Leave blank to disable storage service
  projectId: "app-framework-9045a",                            // Required for Firebase hosting
  allowEmailLogin: true,                                       // true or false
  allowEmailRegistration: true                                 // true or false
}
```

Disabling a service will reduce the build size.

You can use Firebase in any Vue hook `created` or later:

- `window.firebase` - Firebase application instance
- `this.$root.user` or window.user - Null or object (uid, email, name, photo)
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
  projectId: "dev-app-framework",
  allowEmailLogin: true,
  allowEmailRegistration: true
}
```

If you set `deployDevRulesOnTesting: true`, on each test command (`npm run dev`, `npm run ios` and `npm run android`), the *database-rules.json* and *storage-rules.txt* files are deployed to your devFirebase project.

#### State restoration

After an application switch or closure, the application state may be reset. This means, if your user changed the page or tab, scrolled, opened modals, put in some data before - everything will be gone.

App Framework has an automatic state restoration on each application restart, to let your users continue with the same application state they have had before they left the application.

This restoration includes the following elements:

- URL history per view
- Selected tabs (requires unique ID attribute per page)
- Scroll positions
- Side panels
- Action sheets (requires unique ID attribute)
- Login screens (requires unique ID attribute)
- Pickers (requires unique ID attribute)
- Popups (requires unique ID attribute)
- Form inputs (requires unique form ID attribute and unique NAME attributes per form)
- Focus on form input (requires unique NAME attributes per form)
- Page component data

The state is not restored for standard modals, popovers and code-generated modals.

If you use `v-model` on an input, the state will be restored by page component data, you can use a name attribute, but it is not required in this case.

### Test your application

- Run `npm run dev` to start the development server in the web browser
  - `CTRL + C` to stop the development server
- Run `npm run ios` to open an iOS simulator with a development build
- Run `npm run android` to open an Android emulator with a development build

  Confirm Gradle sync and removal of older application installations if asked.

  If you get an error *Failed to find 'JAVA_HOME' environment variable. Try setting setting it manually.* you have to install the Java SE SDK first.

App Framework fix your code automatically on each test or build command. To disable this behavior, you can set the config parameter *fixCodeOnBuild* to false. If some findings could not be fixed automatically, they will be logged to *code-findings.log*.

If *dev-firebase* is configured in *config.json* file, on each test command, the Firebase database and storage rules are deployed automatically.

### Build your application

To deploy your application you need to build it before. *App Framework* makes it quite easy again for you, bumps the version, compiles the scripts and merges them together. Your logo is used to create many icons and launch screen graphics and at the end all files are compressed to save bandwidth.

Each build command will update the *build* folder on success.

- Run `npm run patch` after bug-fixes and improvements (version bump to x.y.z+1)
- Run `npm run minor` after adding new functionality (version bump to x.y+1.0)
- Run `npm run major` after breaking backward-capability (version bump to x+1.0.0)

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
- For rollback, run all the commands above and extend with ` -- --version x.y.z` or use the Firebase Console

Deployment to the Apple App Store (native App)

- You need a Mac with [macOS](http://www.apple.com/de/macos/) and installed [Xcode](https://developer.apple.com/xcode/) (free)
- You need to sign to the [Apple developer program](https://developer.apple.com/programs/) (around 99€ per year)
- Create a production certificate in iTunes Connect, download and install it on your Mac
- Create a distribution provisioning profile in iTunes Connect, download and install it on your Mac
- You need to prepare the publishing in [iTunes Connect](https://itunesconnect.apple.com/)
- Run `npm run xcode` to create a project file for Xcode, based on [Cordova](https://cordova.apache.org/)
- Make screenshots on the biggest iPhone (you will need them in iTunes Connect later on)
- Deactivate automatic managed signing, select your certificate and provisioning profiles created before
- Select the Generic iOS Device
- Create an archive (Product > Archive) of the Xcode project and upload it to iTunes Connect
- Send your App in iTunes Connect for the review to Apple
- For rollback, run `npm run xcode -- --version x.y.z` or use iTunes Connect

Deployment to the Google Play Store (native App)

- You need to install the [Android Studio](https://developer.android.com/studio/)
- You need to register at the [Google Play Developer Console](https://play.google.com/apps/publish/signup/) (around 25 USD once)
- Run `npm run studio` to create a project file for Android Studio, based on [Cordova](https://cordova.apache.org/)
- Select your project and confirm Gradle sync
- Make screenshots, you will need them later in the Google Play Developer Console
- Generate signed APK
- Log in to the Google Play Developer console to deploy your application
- For rollback, run `npm run studio -- --version x.y.z` or use the Google Play Developer Console

### Backup your project

- Run `npm run backup` to save the Firebase database content and user list as JSON to the *snapshots* folder
- Run `npm run snapshot` to create a snapshot of all important project files to the *snapshots* folder
- Backup your project folder frequently by
  - Copying the *snapshots* folder to any external drive or cloud
  - *and/or* pushing and synchronizing your changes to GitHub

## References

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
limitApplicationWidth | /^[0-9]+$/ | 375
limitApplicationHeight | /^[0-9]+$/ | 675
showPhoneFrameOnDesktop | *boolean* | true
materialSubnavbarFix | *boolean* | true
completeRoutesFile | *boolean* | true
firebase | *object* |
&nbsp;&nbsp;&nbsp;apiKey | *string* |
&nbsp;&nbsp;&nbsp;authDomain | *string* |
&nbsp;&nbsp;&nbsp;databaseURL | *string* |
&nbsp;&nbsp;&nbsp;storageBucket | *string* |
&nbsp;&nbsp;&nbsp;projectId | *string* |
&nbsp;&nbsp;&nbsp;allowEmailLogin | *boolean* | false
&nbsp;&nbsp;&nbsp;allowEmailRegistration | *boolean* | false
devFirebase | *object* |
&nbsp;&nbsp;&nbsp;deployDevRulesOnTesting | *boolean* | false
&nbsp;&nbsp;&nbsp;apiKey | *string* |
&nbsp;&nbsp;&nbsp;authDomain | *string* |
&nbsp;&nbsp;&nbsp;databaseURL | *string* |
&nbsp;&nbsp;&nbsp;storageBucket | *string* |
&nbsp;&nbsp;&nbsp;projectId | *string* |
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

### CLI commands

This is an overview and reference, please see the [Workflow](#workflow) for details.

![Process](media/cli-commands.png)

- Setup
  - `npm install` to install App Framework and setup the project folder
  - `npm update` to update App Framework to the latest sub version

- Testing
  - `npm run dev` to start the development server in the web browser
    - `CTRL + C` to stop the development server
  - `npm run ios` to open Xcode with a development build
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
  - `npm run backup` to create snapshots of the Firebase database and user list
  - `npm run snapshot` to create a snapshot of your project folder
