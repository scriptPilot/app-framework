# App Framework - Documentation

> First contact with App Framework? Please read our [readme file](README.md) first!

- [ ] [Requirements](#requirements)
- [ ] [Development environment](#development-environment)
- [ ] **Workflow**
  - [ ] [Setup your project](#setup-your-project)
  - [ ] [Design your application](#design-your-application)
  - [ ] [Develop your application](#develop-your-application)
    - [ ] [App component](#app-component)
    - [ ] [Page components](#page-components)
    - [Application style](#application-style)
    - [Status bar style](#status-bar-style)
    - [Global data object](#global-data-object)
    - [ ] [Firebase backend](#firebase-backend)
    - [ ] [Import modules](#import-modules)
  - [ ] [Test your application](#test-your-application)
  - [ ] [Build your application](#build-your-application)
  - [ ] [Deploy your application](#deploy-your-application)
  - [ ] [Backup your project](#backup-your-project)
- [ ] **References**
  - [ ] [CLI commands](#cli-commands)
  - [ ] [Project folder structure](#project-folder-structure)
  - [ ] [Configuration options](#configuration-options)

> Read less, code more - [ ] please open a ticket for any open question in our [issue list](https://github.com/scriptPilot/app-framework/issues).

## Workflow

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

## References

## CLI commands

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
  - `npm run backup` to create a snapshot of the Firebase database and user list
  - `npm run snapshot` to create a snapshot of your project folder
