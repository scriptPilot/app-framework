# App Framework
> Does all the tricky stuff for you to develop, test, build and deploy iOS and Android like web applications.

## Features

**Beautiful**
- All well known [iOS](http://framework7.io/kitchen-sink-ios/) and [Material](http://framework7.io/kitchen-sink-material/) user interface components as well as native transitions
- Comprehensive icon fonts like [FontAwesome](http://fontawesome.io/), [Framework7](http://framework7.io/icons/), [Ion](http://ionicons.com/) and [Material Icons](https://material.io/icons/)

**Powerful**

- ... wip ...

**Timesaving**

- ... wip ...

## Documentation

> Read less, do more - please open a ticket for any open question, bug or feature request in our [Issue List](https://github.com/scriptPilot/app-framework/issues).

### Required knowledge

- [Node.js with npm](https://docs.npmjs.com/getting-started/what-is-npm)
- [Framework7](https://framework7.io/docs/) / [Framework7-Vue](https://framework7.io/vue/)

Optional

- [Vue](https://vuejs.org/v2/guide/)
- [Firebase](https://firebase.google.com/docs/web/setup)

### Setup your development environment

- Download *[package.json](https://raw.githubusercontent.com/scriptPilot/app-framework/master/demo-app/package.json)* file to an empty folder
- Run `npm install` to setup project folder

### Develop your application

- Run `npm run dev` to start development server at localhost:8080
- Adjust configuration in *package.json* file
- Change main module in *app.vue* file
- Change pages in *pages* folder
- Save images to *images* folder

### Test your application

- Run `npm run check` to check files according [Standard JavaScript](http://standardjs.com/index.html)
- Run `npm run fix` to fix files as far as possible according [Standard JavaScript](http://standardjs.com/index.html)
- Use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) to debug your application

### Build your application

- Run `npm run patch` after bugfixes and improvements
- Run `npm run minor` after adding new functionality
- Run `npm run major` after breaking backward-capability

### Deploy your application

- Run `npm run database` to overwrite the Firebase database rules with the content of *databaseRules.json*
- Run `npm run deploy` to push newest build to [Firebase Hosting](https://firebase.google.com/docs/hosting/)
 - For rollback go to the Firebase Console > Hosting
- *or* upload the content of the *www* folder to your own server
 - For rollback change the version in *www/.htaccess* file and upload this to your server
- Run `npm run backup` to save the Firebase database content to *databaseBackup.json* file
 
