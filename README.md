# App Framework

A combination of great pieces of open source code to let you develop, build and deploy a new application in minutes. With App Framework, you can spend your time for what makes your application unique, not the tricky stuff around!

![Process](./docs/images/processSmall.png)

## Features

- [ ] **Powerful JavaScript Framework** - Based on [Vue.js](https://vuejs.org/) or [React](https://reactjs.org/)
- [ ] **Beautiful UX Framework** - Choose [Framework7](https://framework7.io/), [Bootstrap](https://getbootstrap.com/) or [Material Design](https://material.io/design/).
- [ ] **Comprehensive Icon Fonts** like [FontAwesome](http://fontawesome.io/), [Framework7 Icons](http://framework7.io/icons/), [Ion](http://ionicons.com/) and [Material Design Icons](https://material.io/icons/) out of the box.
- [ ] **Hardware APIs** - Provided by [Capacitor](https://capacitor.ionicframework.com/) and [Cordova](https://cordova.apache.org/).
- [ ] **One Code Base** - With HTML, CSS and JavaScript with ES6 support.
- [ ] **Live Development** - In the Web Browser or an [Electron](https://electronjs.org/) shell.
- [ ] **Native Deployment** as [PWA](https://developers.google.com/web/progressive-web-apps/), as mobile App (iOS or Android) or desktop App (macOS, Windows or Linux).

## Quick Start

Run `npx app-framework` to open a wizard which will guide you to your new application project.

## CLI Commands

- Run **`npx app dev`** to start a development server in the web browser
   - Run `npx app dev electron` to start a development server in an Electron shell
- Run **`npx app build`** to build your application according your configuration
  - Run `npx app build pwa` to build and open an Xcode project
  - Run `npx app build ios` to build and open an Xcode project
  - Run `npx app build android` to build and open an Android Studio project
  - Run `npx app build macos` to build and open an Xcode project
  - Run `npx app build windows` to build and open an Xcode project
  - Run `npx app build linux` to build and open an Xcode project
- Run **`npx app deploy`** to deploy your application according your configuration
  - Run `npx app deploy firebase` to deploy the latest build to any Firebase project
  - Run `npx app deploy ftp` to deploy the latest build to any FTP server
- Run `npm update` to update App Framework to the latest version
