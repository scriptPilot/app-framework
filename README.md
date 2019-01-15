# App Framework

> This version 3 is still under development. You may use [version 1](https://github.com/scriptPilot/app-framework/tree/v1) instead.

**iOS and Android Apps with HTML & JavaScript. App Framework combines great pieces of open source code to support your whole workflow with useful scripts and your App with powerful plugins. With App Framework, you can spend your time for your next amazing App and not for the tricky stuff around - free and open source!**

![](media/process.png)

## Features

### Core

- [x] **Beautiful User Interface** with native iOS and Material Design elements and transitions, based on [Framework7](https://framework7.io/)
- [x] **Flexible Routing** for pages, tabs, modals and panels with dynamic routing support, realized with [Framework7-Vue](https://framework7.io/vue/navigation-router.html)
- [ ] **Multi-language Support** with language files and automatic completeness checks according the default language
- [x] **Offline Capability** to use the app even without any network connection
- [x] **One Code Base** for all devices with HTML, CSS and JavaScript, realized with [Capacitor](https://capacitor.ionicframework.com/), supporting [ES2015](https://babeljs.io/learn-es2015/)
- [x] **Single File Components** for powerful but easy to maintain apps, made with [Vue.js](https://vuejs.org/) and [Framework7-Vue](http://framework7.io/vue/)
- [x] **Project Folder Creation**, lightweight and well-organized, ready to publish on [GitHub](https://github.com/about)

### Scripts

- [x] **Live Development Server** with hot module replacement, powered by [Parcel](https://parceljs.org/)
- [x] **Test on your own Device** or in any iOS or Android emulator, supported by [Capacitor](https://capacitor.ionicframework.com/), [Xcode](https://developer.apple.com/xcode/) and [Android Studio](https://developer.android.com/studio)
- [x] **Test Framework** for code correctness and standard conformity with [ESLint](http://eslint.org/) and for unit tests with [Jest](https://facebook.github.io/jest/)
- [x] **Optimized Build Process** for good scores at [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/), realized with [Parcel](https://parceljs.org/)
- [ ] **Icon Generation** for favicon, icons and splash screens, out of a single image file with [Jimp](https://github.com/oliver-moran/jimp)
- [x] **Easy Deployment** without downtime to [Apple App Store](https://developer.apple.com/xcode/), [Google Play Store](https://developer.android.com/studio), [Firebase Hosting](https://firebase.google.com/products/hosting/) or any FTP server

### Plugins

- [x] **Native Hardware API Plugins** for iOS and Android devices, realized with [Capacitor](https://capacitor.ionicframework.com/)
- [ ] **Comprehensive Icon Fonts** like [FontAwesome](http://fontawesome.io/), [Framework7 Icons](http://framework7.io/icons/), [Ion](http://ionicons.com/) and [Material Design Icons](https://material.io/icons/) out of the box
- [ ] **Phone Frame** around your application on big screens, so you can offer desktop access with charm
- [ ] **State Restoration** for the history per view, tabs, scroll positions, focus, panels, modals and form inputs
- [ ] **Global Data Object** to save user data across several application restarts easily
- [ ] **Vuex Integration** to use the official Vue.js [state management library](https://vuex.vuejs.org/en/intro.html)
- [ ] **Preloading** for images, fonts and JavaScript files
- [ ] **Firebase Integration** for several services like [Authentication](https://firebase.google.com/products/auth/), [Realtime Database](https://firebase.google.com/products/realtime-database/), [Firestore](https://firebase.google.com/products/firestore/) and [Cloud Storage](https://firebase.google.com/products/storage/)

## Demo App

The Apple App Store app may be outdated because Apple blocks demo apps from their store now.

[![Download on the App Store Play](media/download-icon-app-store.png)](https://itunes.apple.com/us/app/app-framework-demo/id1203927581?mt=8')
&nbsp;&nbsp;&nbsp;
[![Get it on Google Play](media/download-icon-play-store.png)](https://play.google.com/store/apps/details?id=de.scriptpilot.appframework)
&nbsp;&nbsp;&nbsp;
[![Open as Web App](media/download-icon-firebase.png)](https://demo.app-framework.com)

![Screenshots](media/demo-app-screenshots.png)

## Documentation

### Quick Start

1. Run `mkdir my-app` to create a new project folder
2. Run `cd my-app` to open the project folder
3. Run `echo {} > package.json` to create an empty json file
4. Run `npm install app-framework` for installation
5. Run `npx app dev` to start the local development server

### Workflow

- Setup your development environment
- Start and configure your app project
- Develop your application
  - Modify the app component
  - Modify page components and the routing
  - Use CSS style sheets
  - [Use image files](./docs/development-images.md)
  - Use Node packages
  - Use hardware APIs
- Test your application
- Deploy your application
  - to any FTP server
  - to Firebase Hosting
  - to the Apple App Store
  - to the Android Play Store

### CLI Reference

- Run `npx app test` to run all configured tests
- Run `npx app test eslint` to run the ESLint test
- Run `npx app test jest` to run the Jest tests
- Run `npx app dev` to open the application on the development server
- Run `npx app build` to build the application according the configuration
- Run `npx app deploy ftp` to deploy the PWA to any FTP server
- Run `npx app deploy firebase` to deploy the PWA to Firebase Hosting
