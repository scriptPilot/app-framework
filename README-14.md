# App Framework &nbsp; &nbsp; &nbsp; [![](https://img.shields.io/npm/dt/app-framework.svg)](https://www.npmjs.com/package/app-framework) [![](https://img.shields.io/npm/v/app-framework.svg)](https://www.npmjs.com/package/app-framework) [![](https://img.shields.io/npm/l/app-framework.svg)](https://www.npmjs.com/package/app-framework)

**iOS and Android Apps with HTML & JavaScript - develop, build and deploy - free and open source!**

![Process](media/process.png)

## Features

- **Global data object** to use the same data accross your whole application
- **State restoration** for histories, scroll positions, selected tabs, modals, focus, form inputs and component data



> The power is under the hood - but for sure, we have a Demo App.

[![Download on the App Store Play](media/app-store-download.png)](https://itunes.apple.com/us/app/app-framework-demo/id1203927581?mt=8')
&nbsp;&nbsp;&nbsp;
[![Get it on Google Play](media/google-play-download.png)](https://play.google.com/store/apps/details?id=de.scriptpilot.appframework)
&nbsp;&nbsp;&nbsp;
[![Open as Web App](media/web-app-visit.png)](https://app-framework.scriptpilot.de/)

Setup your development environment:

- Creation of a lightweight and well-organized project folder, ready for [GitHub](https://github.com/about)
- [Demo App](https://app-framework.scriptpilot.de/) to use as base for your own application with typical use cases

Design your application:

- Printable [template](design/smartphone-template.pdf) to design your application with paper and pencil
- Template for your icon design - as [PDF for sketching](design/icon-template.pdf) and [PPTX](design/icon-template.pptx) for drawing

Develop your application:

- Realize beautiful user interfaces with all well-known components and transitions, based on [Framework7](https://framework7.io/)
- Easy to maintain [single file components](https://vuejs.org/guide/single-file-components) with [reusable UI elements](https://framework7.io/vue/)
- One code base for all devices with HTML, CSS and JavaScript - realized with [Cordova](https://cordova.apache.org/), supporting [ES2015](https://babeljs.io/learn-es2015/)
- Use comprehensive icon fonts like [FontAwesome](http://fontawesome.io/), [Framework7](http://framework7.io/icons/), [Ion](http://ionicons.com/) and [Material Icons](https://material.io/icons/) out of the box
- Well prepared to use [Firebase authentication](https://firebase.google.com/docs/auth/), [realtime database](https://firebase.google.com/docs/database/) and [storage services](https://firebase.google.com/docs/storage/)
- State kept for history, tabs, scroll positions, focus, panels, modals, form inputs and page component data
- Offline capability, flexible routing and multi-language support out of the box

Test your application:

- Integrated code check for [correctness](http://eslint.org/) and automatic fix for [standard conformity](http://standardjs.com/)
- Local development server with live reload, perfectly to use together with [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
- Test your application on any iOS or Android device with an emulator or on your own device
- Use a development Firebase project with automatic [database](https://firebase.google.com/docs/database/) and [storage](https://firebase.google.com/docs/storage/) rule update

Build your application:

- Build process with version bump and compression of all HTML, CSS, JavaScript and image files
- Generation of favicons, touch icons and splash screens out of a single image file
- Phone frame around your application on big screens, so you can offer desktop access with charm
- Automatic build as web application, to be used online and offline in the browser
- Automatic [Apple Xcode](https://developer.apple.com/xcode/) project build with [Cordova](https://cordova.apache.org/)
- Automatic [Android Studio](https://developer.android.com/studio) project build with [Cordova](https://cordova.apache.org/)

Deploy your application:

- Deployment without downtime
  - to any FTP server as Web App
  - to the [Firebase Hosting service](https://firebase.google.com/docs/hosting/) as Web App
  - to the [Apple App Store](https://itunes.apple.com/de/) as native iOS App
  - to the [Google Play Store](https://play.google.com/) as native Android App
- Easy rollback solutions

Backup your application:

- Download your [Firebase database content](https://firebase.google.com/docs/database/) and [user list](https://firebase.google.com/docs/auth/) to local JSON files
- Snapshot creation of all important project files to backup on any external drive or cloud service

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
4. Run `npm run dev` to start the Demo App at localhost:8080
5. Read our [Documentation](DOCUMENTATION.md)
