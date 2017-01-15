# App Framework
Framework to build iOS and Android Apps in minutes ([demo](http://app-framework.scriptpilot.de/))

### Installation

As prerequisite you should understand the principles of [Node.js and npm](https://docs.npmjs.com/getting-started/what-is-npm).

This framework must be installed as dependency to your project - do not clone or download it directly.

1. Create an empty project folder on your computer
2. Save [package.json](https://raw.githubusercontent.com/scriptPilot/app-framework/master/hello-world-app/package.json) file to your project folder
3. Run `npm install` to setup your project folder

### Configuration

You can configure your application in the `package.json` file.

### Development

As prerequisite you should be comfortable with [Vue](https://vuejs.org/v2/guide/) and  [Framework7](http://framework7.io/docs/).

1. Run `npm run dev` to start development server at localhost:8080
2. Change your application
 - App components in `app.vue` file
 - Page components in `pages` folder
3. Build your application with
 - `npm run patch` after bugfixes and improvements
 - `npm run minor` after adding new functionality
 - `npm run major` after breaking backward-capability

In addition you should know about [Framework7-Vue components](https://github.com/nolimits4web/Framework7-Vue), [Firebase](https://firebase.google.com/docs/web/setup) and [Standard JavaScript](http://standardjs.com/rules.html)
 
### Deployment

1. Upload the latest build folder `www/build-...` to your web server
2. Change version in `www/.htaccess` file and upload to your web server

For rollback, change version in `www/.htaccess` file to previous version and upload to your web server.

### Feedback, bugs, feature requests
Please use the [Issues page](https://github.com/scriptPilot/app-framework/issues) or provide a pull request. For more complex changes please let us discuss before.

---



**ATTENTION**: Release 1.0.0 planned for end of January. For now, your initial [feedback](https://github.com/scriptPilot/app-framework/issues/1) is highly appreciated!

## Features (work in progress)
A composition of great software projects.
- **Beautiful**
 - [x] Native design and animations - [Framework7](http://framework7.io/)
 - [x] No bouncing on iOS - [iNoBounce](https://github.com/lazd/iNoBounce)
 - [x] Icon fonts - [iOS](https://github.com/nolimits4web/Framework7-Icons) and [Android](https://material.io/icons/)
 - [ ] Favicon generator - [Favicons](https://github.com/haydenbleasel/favicons)
- **Powerful**
 - [x] Reactive user interface - [Vue](https://vuejs.org/)
 - [ ] Flexible routing - [Framework7-Vue](https://github.com/nolimits4web/Framework7-Vue)
 - [ ] State kept for page, tab, scroll position, form focus, form data and page data
 - [x] Multi-language support
 - [x] Offline capability
 - [ ] User authentication - [Firebase](https://firebase.google.com/)
 - [ ] Data backend - [Firebase](https://firebase.google.com/)
 - [ ] Storage backend - [Firebase](https://firebase.google.com/)
- **Complete**
 - [x] Quick start - [npm](https://www.npmjs.com)
 - [x] Development server with live reload - [Webpack-dev-server](https://github.com/webpack/webpack-dev-server)
 - [ ] Code check - [ESLint](http://eslint.org/)
 - [x] Single file components - [Vue](https://vuejs.org/v2/guide/single-file-components.html)
 - [x] Reusable components - [Framework7-Vue](https://github.com/nolimits4web/Framework7-Vue)
 - [x] Automatic version bump and build process - [Webpack](https://webpack.github.io/)
 - [x] Compression of HTML, CSS, JavaScript and image files
 - [x] Deployment without downtime
 - [x] Fast rollback solution
 - [ ] Clean code - [Standard JavaScript Rules](http://standardjs.com/)

