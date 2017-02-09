# Documentation

> First contact with App Framework? Please read the [Readme file](README.md) first!

Read less, code more - please open a ticket for any open question in our [Issue List](https://github.com/scriptPilot/app-framework/issues).

### Required knowledge

- [Node.js with npm](https://docs.npmjs.com/getting-started/what-is-npm)
- [Framework7](https://framework7.io/docs/) / [Framework7-Vue](https://framework7.io/vue/)

Optional

- [Vue](https://vuejs.org/v2/guide/)
- [Firebase](https://firebase.google.com/docs/web/setup)

### Setup your development environment

- Install [Node.js with npm](https://docs.npmjs.com/getting-started/what-is-npm)
- Download *[package.json](https://raw.githubusercontent.com/scriptPilot/app-framework/master/demo-app/package.json)* file to an empty folder (keep extension .json!)
- Run `npm install` to setup project folder
- Run `npm update` to update *App Framework* to latest sub version

### Design your application
- Use our printable [smartphone template](smartphone-template.pdf) to sketch your application
- Use our icon template as [PDF to sketch](icon-template.pdf) and [PPTX to draw](icon-template.pptx) your application icon

### Develop your application

- Update the configuration in *package.json* file - first of all for Firebase!
- Run `npm run dev` to start development server at localhost:8080
- Save images to *images* folder
- Edit app component in *app.vue* file
- Edit page components in *pages* folder
  - After adding, removing or renaming pages you have to run `npm run dev` again!
  - Study the code of the example pages to learn how to realize things in App Framework
- Edit [database rules](https://firebase.google.com/docs/database/security/quickstart) in *database-rules.json* file
- Edit [storage rules](https://firebase.google.com/docs/storage/security/) in *storage-rules.txt* file

### Test your application

- Run `npm run check` to check files according [Standard JavaScript](http://standardjs.com/index.html)
- Run `npm run fix` to fix files as far as possible according [Standard JavaScript](http://standardjs.com/index.html)
- Use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) to debug your application

### Build your application

- Run `npm run patch` after bugfixes and improvements
- Run `npm run minor` after adding new functionality
- Run `npm run major` after breaking backward-capability

### Deploy your application

To your own server

- Upload the latest *www/build* folder to your server and then the *www/.htaccess* file
- For rollback: Change the version in *www/.htaccess* file to the previous one and upload it to your server

To [Firebase Hosting](https://firebase.google.com/docs/hosting/)

- Run `npm run database` to overwrite the Firebase database rules with the content of *database-rules.json*
- Run `npm run storage` to overwrite the Firebase storage rules with the content of *storage-rules.txt*
- Run `npm run hosting` to push newest build to Firebase Hosting
- For rollback: Change the version in *www/.htaccess* file to the previous one and run `npm run hosting`

To the Apple App Store (more details will follow in our Tutorial)

- You need a Mac with [macOS](http://www.apple.com/de/macos/) and installed [Xcode](https://developer.apple.com/xcode/) (free)
- You need to sign to the [Apple developer program](https://developer.apple.com/programs/) (around 99€ per year)
- You need to prepare the publishing in [iTunes Connect](https://itunesconnect.apple.com/)
- Run `npm run ios` to create a project file for Xcode, based on [Cordova](https://cordova.apache.org/)
- Test your application on several devices, make screenshot on biggest iPhone (you will need them in iTunes Connect later on)
- Create archive of the Xcode project and upload it within Xcode to iTunes Connect
- Send your App in iTunes Connect for review
 
### Backup your application

- Run `npm run backup` to save the Firebase database content to *database-backup.json* file
- Run `npm run zip` to save your project files and latest build to a zip file
- Backup your project folder frequently by
 - Moving the zip file to any external drive or cloud
 - *and/or* Pushing and synchronizing your changes to GitHub
