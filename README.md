# App Framework v4

> App Framework v4 is still under development. The latest stable version is [App Framework v1](https://github.com/scriptPilot/app-framework/blob/v1/README.md).

## About

App Framework combines great pieces of open source code, to do all the tasks for you, which are required to create and build applications based on HTML, CSS and JavaScript for multiple platforms.

&nbsp;

![Development Process](images/process.png)

&nbsp;

## Purpose

- [ ] You can create new application projects in seconds.
- [ ] You can use your favorite frameworks and libraries.
- [ ] You never have to worry about build processes again.
- [ ] You never have had such a tidy project folder before.
- [ ] App Framework can be your sole development dependency.
- [ ] App Framework is free and open source.

## Features

- [ ] **Project Folder Creation** - lightweight and well-organized.
- [ ] **Powerful JavaScript Frameworks** - like [Angular](https://angular.io/), [React](https://reactjs.org/), [Vue.js](https://vuejs.org/) or your favorite one.
- [ ] **Beautiful UX Frameworks** - like [Material Design](https://material.io/), [Bootstrap](https://getbootstrap.com/), [SAP UI5](https://sap.github.io/ui5-webcomponents/), [Framework7](https://framework7.io/) or your favorite one.
- [ ] **Comprehensive Icon Fonts** - use [Material Design Icons](https://material.io/tools/icons/?style=baseline), [Framework7 iOS Icons](https://framework7.io/icons/), [Font Awesome](https://fontawesome.com/) or any other.
- [ ] **Native Hardware APIs** - supported by [Capacitor](https://capacitor.ionicframework.com/) and [Cordova](https://cordova.apache.org/).
- [ ] **Development Server** - with live reload in the web browser or an [Electron](https://electronjs.org/) shell.
- [ ] **Automated Code Fix** - with [ESLint](https://eslint.org/) according the [Airbnb Style Guide](https://github.com/airbnb/javascript), [Standard JS](https://standardjs.com/) or your own rules.
- [ ] **Asset Generation** - for icons, splash screens, the manifest, the robots file and service worker.
- [ ] **Optimized Build Process** - to get excellent scores at [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/) and other audits.
- [ ] **Multiple Build Targets** - as [PWA](https://developers.google.com/web/progressive-web-apps/), mobile (iOS, Android) or desktop application (macOS, Windows, Linux).
- [ ] **Automated Deployment** - to any FTP server or [Firebase](https://firebase.google.com/).

## CLI Commands

**Create** a new application project (run in an empty folder):

```
npx app-framework
```

**Start** the development server:

```
npx app start             # as configured
npx app start web         # in the web browser
npx app start electron    # in an Electron shell
```

**Build** your application:

```
npx app build             # as configured
npx app build pwa         # as PWA only
npx app build ios         # as Xcode project only
npx app build android     # as Android Studio project only
npx app build macos       # as macOS application only
npx app build windows     # as Windows application only
npx app build linux       # as Linux application only
```

**Deploy** your application:

```
npx app deploy            # as configured
npx app deploy ftp        # to an FTP server only
npx app deploy firebase   # to Firebase only
```
