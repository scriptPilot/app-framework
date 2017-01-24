# App Framework - Documentation

> Your first contact with *App Framework*? Please take a look at the [readme file](README.md) first!

- [Install App Framework](#install-app-framework)
- [Update App Framework](#update-app-framework)
- [Test application](#test-application)
- [Build application](#build-application)
- [Deploy application](#deploy-application)

#### Install App Framework

As prerequisite you should understand the principles of [Node.js and npm](https://docs.npmjs.com/getting-started/what-is-npm). After you have installed both to your computer, you have to save the prepared [package.json file](https://raw.githubusercontent.com/scriptPilot/app-framework/master/demo-app/package.json) to an empty folder. To install *App Framework* and create the application template, run `npm install` in your command line tool.

#### Update App Framework

The allowed *App Framework* [version](https://docs.npmjs.com/misc/semver) is defined in the `package.json` file. Run `npm update` to start the update process. Run `npm update --save-dev` if you like to have the updated version copied to `package.json`.

#### Test application

* To test the user interface and functionality, you have to start the development server with `npm run dev`. Open your web browser if not done automatically and navigate to *localhost:8080* to open your application.
* The code will be checked for correctness on build process, please take a look in the console.

#### Build application

Before you build your application it should be tested well. Then you start the version bump and build process as follows:

- `npm run patch` after bugfixes and improvements
- `npm run minor` after adding new functionality
- `npm run major` after breaking backward-capabiliy

After the build process has finished successful, a new folder `www/build-...` was created with all static files.

#### Deploy application

1. Upload the latest build folder `www/build-...` to your web server
2. Change version in `www/.htaccess` file and upload it to your web server

For rollback, change version in `www/.htaccess` file to previous one and upload it to your web server.

> Your question is not answered? You have feature requests or found some bugs or typos? Please use our [GitHub Issue list](https://github.com/scriptPilot/app-framework/issues)!
