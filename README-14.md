# App Framework &nbsp; &nbsp; &nbsp; [![](https://img.shields.io/npm/dt/app-framework.svg)](https://www.npmjs.com/package/app-framework) [![](https://img.shields.io/npm/v/app-framework.svg)](https://www.npmjs.com/package/app-framework) [![](https://img.shields.io/npm/l/app-framework.svg)](https://www.npmjs.com/package/app-framework)

**iOS and Android Apps with HTML & JavaScript - develop, build and deploy - free and open source!**

![Process](media/process.png)

## Features

- [ ] **Project folder generation** - lightweight, well-organized and ready for Git publishing
- [ ] **Single file components** - with template, scripts and style included to manage big projects easily
- [ ] **Beautiful user interface** - with all well-known iOS and Material elements and transitions
- [ ] **Comprehensive icon fonts** - [FontAwesome](http://fontawesome.io/), [Framework7](http://framework7.io/icons/), [Ion](http://ionicons.com/) and [Material Icons](https://material.io/icons/) out of the box to use
- [ ] **Powerful user interface** - state-based and reactive with the simplicity of [Vue.js](https://vuejs.org/), ready for [ES2015](https://babeljs.io/learn-es2015/)
- [ ] **Reliable backend** - use Firebase for [authentication](https://firebase.google.com/docs/auth/), [realtime database](https://firebase.google.com/docs/database/) and [storage services](https://firebase.google.com/docs/storage/)
- [ ] **State restoration** - for history, tabs, scroll positions, form inputs, focus, modals and component data
- [ ] **Local testing** - on a server with live-reload, on your own device or on any iOS or Android simulator
- [ ] **Integrated checks** - with automatic fix for code [correctness](http://eslint.org/) and [standard conformity](http://standardjs.com/)
- [ ] **Optimized build** - with version bump, icon generation and compression of all code and image files
- [ ] **Safe deployment** - without downtime to any FTP server, [Firebase hosting](https://firebase.google.com/docs/hosting/), [iOS project](https://developer.apple.com/xcode/) or [Android project](https://developer.android.com/studio)
- [ ] **Snapshots** - of the Firebase backend and all project files to backup on any external drive or cloud
- [ ] **Many more** - like offline capability, flexible routine, multi-language support, ...

## Demo App

[![Download on the App Store Play](media/app-store-download.png)](https://itunes.apple.com/us/app/app-framework-demo/id1203927581?mt=8')
&nbsp;&nbsp;&nbsp;
[![Get it on Google Play](media/google-play-download.png)](https://play.google.com/store/apps/details?id=de.scriptpilot.appframework)
&nbsp;&nbsp;&nbsp;
[![Open as Web App](media/web-app-visit.png)](https://app-framework.scriptpilot.de/)

## Milestones

Upcoming:

- [1.4 - Client code robustness improvements](https://github.com/scriptPilot/app-framework/milestone/9)
- [1.5 - Demo App robustness improvements](https://github.com/scriptPilot/app-framework/milestone/10)
- [1.6 - Tutorial: ToDo App](https://github.com/scriptPilot/app-framework/milestone/3)
- [1.7 - Extensions](https://github.com/scriptPilot/app-framework/milestone/7)
- [1.8 - GUI helper tool](https://github.com/scriptPilot/app-framework/milestone/8)

Closed:

- [1.3 - CLI robustness improvements](https://github.com/scriptPilot/app-framework/milestone/6?closed=1) (2017-03-19)
- [1.2 - Google Play Store deployment](https://github.com/scriptPilot/app-framework/milestone/5?closed=1) (2017-02-12)
- [1.1 - Apple App Store deployment](https://github.com/scriptPilot/app-framework/milestone/4?closed=1) (2017-02-10)
- [1.0 - Initial Release](https://github.com/scriptPilot/app-framework/milestone/1?closed=1) (2017-02-05)

## Required knowledge

Essentiell:

- [Node.js and npm](https://docs.npmjs.com/getting-started/what-is-npm) for command line interface handling
- [Framework7](https://framework7.io/docs/) and [Framework7-Vue](https://framework7.io/vue/) to develop with HTML and JavaScript

Optional:

- [Vue.js](https://vuejs.org/v2/guide/) to make your application state-based and reactive
- [Firebase services](https://firebase.google.com/docs/web/setup) as free and reliable backend service provider
- [Cordova/PhoneGap](https://cordova.apache.org/docs/en/latest/) to use device hardware API plugins
- [iOS design guidelines](https://developer.apple.com/ios/human-interface-guidelines/overview/design-principles/) and [Material design guidelines](https://material.io/guidelines/)

## Quick start

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
4. Run `npm run dev` to run your application at localhost:8080
5. Read our [Documentation](DOCUMENTATION.md)
