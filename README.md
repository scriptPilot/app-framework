# App Framework
:iphone: Framework to build iOS and Android Apps in minutes ([demo](http://app-framework.scriptpilot.de/))

**ATTENTION**: Release 1.0.0 planned for end of January. For now, your initial [feedback](https://github.com/scriptPilot/app-framework/issues/1) is highly appreciated!

## Features
- [x] **Native design** for iOS and Android, powered by the beautiful [Framework7](http://framework7.io/), supported by [iNoBounce](https://github.com/lazd/iNoBounce)
- [x] **Integrated icons** for [iOS](https://github.com/nolimits4web/Framework7-Icons) and [Android](https://material.io/icons/) 
- [x] **Powerful user interface** with the magic of [Vue](https://vuejs.org/)
- [x] **Flexible routing** with folder, parameters and and hash tag, done by [Framework7-Vue](https://github.com/nolimits4web/Framework7-Vue)
- [x] **Multi-language support** easily to be added
- [x] **Offline capability** out of the box
- [x] **One file** approach per page with template, script and style included ([info](https://vuejs.org/v2/guide/single-file-components.html))
- [x] **Reusable components** to decrease coding effort with [Framework7-Vue](https://github.com/nolimits4web/Framework7-Vue)
- [x] **Development server** with live reload
- [x] **Build process** with automatic version bump and compression of HTML, CSS, JavaScript, and image files
- [x] **Safe deployment** to server without downtime and with fast rollback

**Planned for version 1.0.0 (before Christmas time)**
- [ ] **State kept** after reload for page, tab, scroll position, form focus, form data and page data
- [ ] **Favicon generator** for plenty of different devices, based on [Favicons](https://github.com/haydenbleasel/favicons) 
- [ ] **Clean code** based on [Standard JavaScript Rules](http://standardjs.com/)

**Planned for later version (development wil start mid of January)**
- [ ] **User management** already integrated with [Firebase](https://firebase.google.com/)
- [ ] **Data backend** already integrated with [Firebase](https://firebase.google.com/)
- [ ] **Storage backend** already integrated with [Firebase](https://firebase.google.com/)

## Quick start
1. Save [package.json](https://raw.githubusercontent.com/scriptPilot/app-framework/master/hello-world-app/package.json) to an empty project folder
2. Run `npm install` to setup project folder
3. Run `npm run dev` to start development server
4. Run `npm run patch` to build application
5. Upload files to your web server

## Documentation
We want to keep it as easy as possible. So if you understand the principles of node, Framework7, Vue and Firebase well, you do not need much explanation for this Framework.

### External documentation
With support of the **Hello World App**, you will be able to build simple applications within minutes, but to build more complex applications, you have to study well the following documentation:
- **[npm and Node](https://docs.npmjs.com/getting-started/what-is-npm)** as development environment
- **[Vue](https://vuejs.org/)** to build reactive user interfaces
- **[Framework7](http://framework7.io/)** to realize native look and feel for iOS and Android
- **[Framework7-Vue components](https://github.com/nolimits4web/Framework7-Vue)** to code less and reach more (optional)
- **[Firebase](https://firebase.google.com/docs/web/setup)** as backend for authentication, database and file storage (optional)
- **[Standard JavaScript](http://standardjs.com/rules.html)** for cleaner code (optional)

### Console commands
In addtion to the common node console commands, you have the following ones available:
* `npm run dev` to start development server with live reload
* `npm run patch` to bump version to x.y.z+1 and build after bugfixing and improvement
* `npm run minor` to bump version to x.y+1.0 and build after adding new functionality
* `npm run major` to bump version to x+1.0.0 and build after breaking the backward-capability

### Configuration options
In the `package.json` file you could configure the following options:
* `title` which is used for the HTML title element
* `theme` standard theme, *ios* or *material* as option
* `lang` standard language, e.g. *en*
* `icons` icon libraries to be bundled
* `routes` routes with route as key and page to be rendered as value

### Variables to use from Vue $root object
* `$root.lang` keeps the application language (e.g. "en" or "de")
* `$root.user` keeps the user information (null or object with uid, email, displayName, photoUrl)
* `$root.theme` keeps the selected application theme ("ios" or "material")

### Deployment
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
For updates, just upload the build folder and after completion change the version in the `.htaccess` file. If you detect any serious issue on production after the release, as rollback, you could easily change back the version in the `.htaccess` file to point again to the previous build folder.

## Feedback, bugs, feature requests
Please use the [Issues](https://github.com/scriptPilot/app-framework/issues) page or provide a pull request. For more complex changes please let us discuss in the issue list before.
