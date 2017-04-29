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
    - [x] [Application style](#application-style)
    - [x] [Status bar style](#status-bar-style)
    - [ ] [Global data object](#global-data-object)
    - [ ] [Firebase backend](#firebase-backend)
    - [ ] [Import modules](#import-modules)
  - [ ] [Test your application](#test-your-application)
  - [ ] [Build your application](#build-your-application)
  - [ ] [Deploy your application](#deploy-your-application)
  - [ ] [Backup your project](#backup-your-project)
- [ ] **References**
  - [ ] [CLI commands](#reference---cli-commands)
  - [ ] [Project folder structure](#reference---project-folder-structure)
  - [ ] [Configuration options](#reference---configuration-options)

> Read less, code more - [ ] please open a ticket for any open question in our [issue list](https://github.com/scriptPilot/app-framework/issues).

## Development

### Application style

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

### Status bar style

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
