# App Framework
Framework to build iOS and Android Apps in minutes ([demo](http://app-framework.scriptpilot.de/))

## Documentation

### Installation

As prerequisite you should understand the principles of [node package manager](https://www.npmjs.com).

This framework must be installed as dependecy to your project - do not clone or download it directly.

1. Create an empty project folder on your computer
2. Save [package.json](https://raw.githubusercontent.com/scriptPilot/app-framework/master/hello-world-app/package.json) to the project folder
3. Run `npm install` to setup project folder

### Development



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
 
## Quick start
1. Save [package.json](https://raw.githubusercontent.com/scriptPilot/app-framework/master/hello-world-app/package.json) to an empty project folder
2. Run `npm install` to setup project folder
3. Run `npm run dev` to start development server
4. Run `npm run patch` to build application
5. Upload files to your web server

## External documentation
- **Essential**
  - [npm and Node](https://docs.npmjs.com/getting-started/what-is-npm)
  - [Vue](https://vuejs.org/v2/guide/)
  - [Framework7](http://framework7.io/docs/)
- **Optional**
  - [Framework7-Vue components](https://github.com/nolimits4web/Framework7-Vue)
  - [Firebase](https://firebase.google.com/docs/web/setup)
  - [Standard JavaScript](http://standardjs.com/rules.html)

## Console commands
* `npm run dev` to start development server with live reload
* `npm run patch` to bump version to x.y.z+1 and build (after bugfixing and improvement)
* `npm run minor` to bump version to x.y+1.0 and build (after adding new functionality)
* `npm run major` to bump version to x+1.0.0 and build (after breaking the backward-capability)

## Configuration options
In the `package.json` file you could configure the following options:
* `title` which is used for the HTML title element
* `theme` standard theme, *ios* or *material* as option
* `lang` standard language, e.g. *en*
* `icons` icon libraries to be bundled
* `routes` routes with route as key and page to be rendered as value

## Variables
To be used from Vue $root object:
* `$root.lang` keeps the application language (e.g. "en" or "de")
* `$root.user` keeps the user information (null or object with uid, email, displayName, photoUrl)
* `$root.theme` keeps the selected application theme ("ios" or "material")

## Deployment
Best practice is to upload the build folder to your web server root folder. Then create a file `.htaccess` in the root folder and put the following code in it and change the version according to your latest build:

  ```
  # Start rewrite engine
  RewriteEngine On

  # Here you specify the build version to be used (two times!)
  RewriteCond %{REQUEST_URI} !^/build-x.y.z/
  RewriteRule ^(.*)$ /build-x.y.z/$1 [L]

  # Forwarding to app home page if file not found
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^build-([0-9.]+)/(.*)?$ /#/$2 [R,L,NE] 
  ```
For updates, just upload the build folder and after completion change the version in the `.htaccess` 

In case of issues, change the version to your last build folder for roll back.

## Feedback, bugs, feature requests
Please use the [Issues](https://github.com/scriptPilot/app-framework/issues) page or provide a pull request. For more complex changes please let us discuss in the issue list before.
