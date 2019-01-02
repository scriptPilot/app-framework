# App Framework 3

App Framework 3 is under development. **For production usage please use [App Framework 1](https://github.com/scriptPilot/app-framework)**. The status of the development can be seen in [this milestone](https://github.com/scriptPilot/app-framework/milestone/8).

You are invited to open any V3 related [question, bug or feature request](https://github.com/scriptPilot/app-framework/issues).

## Get Started

1. Run `mkdir <app_name>` to create a new folder for the application
2. Run `cd <app_name>` to open the newly created folder
3. Run `echo {} > package.json` to create an empty package file
4. Run `npm install --save app-framework@latest` to install latest development release
5. Run `npx app dev` to open application on development server

## CLI Commands

- `npx app test` to run all configured tests
- `npx app dev` to open application on development server
- `npx app build` to build application to */build* folder

## Update

Updating does not work properly as necessary scripts are not completed.
To test the newest development version, you should create a new app.
