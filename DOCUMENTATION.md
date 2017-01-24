# App Framework - Documentation - WORK IN PROGRESS

> Your first contact with *App Framework*? Please take a look at the [readme file](README.md) first!

- [Install App Framework](#install-app-framework)
- [Update App Framework](#update-app-framework)

##Install App Framework

As prerequisite you should understand the principles of [Node.js and npm](https://docs.npmjs.com/getting-started/what-is-npm). After you have installed both to your computer, you have to save the prepared [package.json file](https://raw.githubusercontent.com/scriptPilot/app-framework/master/demo-app/package.json) to an empty folder. To install *App Framework* and create the application template, run `npm install` in your command line tool.

**Update App Framework**

The allowed *App Framework* [version](https://docs.npmjs.com/misc/semver) is defined in the `package.json` file. Run `npm update` to start the update process. Run `npm update --save-dev` if you like to have the updated version copied to `package.json`.

---

 
 - [ ] Favicon generator - [Favicons](https://github.com/haydenbleasel/favicons)
- **Powerful**
 - [x] Reactive user interface - [Vue](https://vuejs.org/)
 
 - [ ] User authentication - [Firebase](https://firebase.google.com/)
 
- **Complete**
 - [x] Reusable components - [Framework7-Vue](http://framework7.io/vue/)
 
 

### Installation

As prerequisite you should understand the principles of [Node.js and npm](https://docs.npmjs.com/getting-started/what-is-npm).

:boom: **This framework must be installed as dependency to your project - do not clone or download it directly!**

1. Create an empty project folder on your computer
2. Save [package.json](https://raw.githubusercontent.com/scriptPilot/app-framework/master/demo-app/package.json) file to your project folder
3. Run `npm install` to setup your project folder

### Configuration

You can configure your application in the `package.json` file.

### Development

As prerequisite you should be comfortable with [Vue](https://vuejs.org/v2/guide/) and  [Framework7](http://framework7.io/docs/).

1. Run `npm run dev` to start development server at localhost:8080
2. Change your application
 - App component in `app.vue` file
 - Page components in `pages` folder
 - Images in `images` folder
3. Build your application with
 - `npm run patch` after bugfixes and improvements
 - `npm run minor` after adding new functionality
 - `npm run major` after breaking backward-capability

In addition you should know about [Framework7-Vue components](http://framework7.io/vue/), [Firebase](https://firebase.google.com/docs/web/setup) and [Standard JavaScript](http://standardjs.com/rules.html).

Please check all example files to see how it works.
 
### Deployment

1. Upload the latest build folder `www/build-...` to your web server
2. Change version in `www/.htaccess` file and upload it to your web server

For rollback, change version in `www/.htaccess` file to previous one and upload it to your web server.

### Improvements, bugs, feature requests
Please use the [Issues page](https://github.com/scriptPilot/app-framework/issues) or provide a pull request. For more complex changes please let us discuss before.
