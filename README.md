# App Framework &nbsp; &nbsp; &nbsp; [![](https://img.shields.io/npm/dt/app-framework.svg)](https://www.npmjs.com/package/app-framework) [![](https://img.shields.io/npm/v/app-framework.svg)](https://www.npmjs.com/package/app-framework) [![](https://img.shields.io/npm/l/app-framework.svg)](https://www.npmjs.com/package/app-framework)

**iOS and Android Apps with HTML & JavaScript - test, build and deploy - free and open source!**

![Process](media/process.png)

## Features

> The power is under the hood - but for sure, we have a Demo App.

<a href='https://play.google.com/store/apps/details?id=de.scriptpilot.appframework&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='media/google-play-download.png' width='150'/></a>
&nbsp;&nbsp;&nbsp;
<a href='https://itunes.apple.com/us/app/app-framework-demo/id1203927581?mt=8'><img alt='Download on the App Store' src='media/app-store-download.png' width='150'/></a>
&nbsp;&nbsp;&nbsp;
<a href='https://app-framework.scriptpilot.de/'><img alt='Download on the App Store' src='media/web-app-visit.png' width='150'/></a>

Setup:

- Creation of a lightweight and well-organized project folder, prepared to push to [GitHub](https://github.com/about)
- [Demo App](https://app-framework.scriptpilot.de/) to use as base for your own application with typical use cases

Design:

- Printable [template](media/smartphone-template.pdf) to design your application with paper and pencil
- Template for your icon design - as [PDF for sketching](media/icon-template.pdf) and [PPTX](media/icon-template.pptx) for drawing

Development:

- Realize beautiful user interfaces with all well-known components and transitions, based on [Framework7](https://framework7.io/)
- Use comprehensive icon fonts like [FontAwesome](http://fontawesome.io/), [Framework7](http://framework7.io/icons/), [Ion](http://ionicons.com/) and [Material Icons](https://material.io/icons/)
- Make your user interface state-based and reactive with the power and simplicity of [Vue.js](https://vuejs.org/)
- Easy to maintain [single page components](https://vuejs.org/guide/single-file-components) and time-saving [UI components](https://framework7.io/vue/)
- One code base for all devices with HTML, CSS and JavaScript - realized with [Cordova](https://cordova.apache.org/), supporting [ES2015](https://babeljs.io/learn-es2015/)
- Well prepared to use [Firebase authentication](https://firebase.google.com/docs/auth/), [realtime database](https://firebase.google.com/docs/database/) and [storage services](https://firebase.google.com/docs/storage/)
- State kept for history, tabs, scroll positions, focus, panels, modals, form inputs and page component data
- Offline capability, flexible routing and multi-language support out of the box

Testing:

- Integrated code checks for [correctness](http://eslint.org/) and [standard conformity](http://standardjs.com/)
- Development server with live reload, perfectly to use together with [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
- Test your application on your own phone or any iOS or Android device with a simulator

Building:

- Build process with version bump and compression of all HTML, CSS, JavaScript and image files
- Generation of favicons, touch icons and splash screens out of a single image file
- Phone frame around your application on big screens, so you can offer desktop access with charm
- Automatic build as web application, to be used online and offline in the browser
- Automatic [Apple Xcode](https://developer.apple.com/xcode/) project build with [Cordova](https://cordova.apache.org/)
- Automatic [Android Studio](https://developer.android.com/studio) project build with [Cordova](https://cordova.apache.org/)

Deployment:

- Deployment without downtime
  - To any FTP server as Web App
  - To the [Firebase Hosting service](https://firebase.google.com/docs/hosting/) as Web App
  - To the [Apple App Store](https://itunes.apple.com/de/) as native iOS App
  - To the [Google Play Store](https://play.google.com/) as native Android App
- Easy rollback solution

Backup:

- Download your [Firebase database content](https://firebase.google.com/docs/database/) to a local JSON file
- Create a ZIP file with all important project files to backup on any external drive or cloud service

## Milestones

Upcoming:

- [v1.4 - Client code robustness improvements](https://github.com/scriptPilot/app-framework/milestone/9)
- [v1.5 - Demo App robustness improvements](https://github.com/scriptPilot/app-framework/milestone/10)
- [v1.6 - Tutorial: ToDo App](https://github.com/scriptPilot/app-framework/milestone/3)
- [v1.7 - Extensions](https://github.com/scriptPilot/app-framework/milestone/7)
- [v1.8 - GUI helper tool](https://github.com/scriptPilot/app-framework/milestone/8)

Closed:

- [v1.3 - CLI robustness improvements](https://github.com/scriptPilot/app-framework/milestone/6?closed=1) (2017-03-19)
- [v1.2 - Google Play Store deployment](https://github.com/scriptPilot/app-framework/milestone/5?closed=1) (2017-02-12)
- [v1.1 - Apple App Store deployment](https://github.com/scriptPilot/app-framework/milestone/4?closed=1) (2017-02-10)
- [v1.0 - Initial Release](https://github.com/scriptPilot/app-framework/milestone/1?closed=1) (2017-02-05)

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
