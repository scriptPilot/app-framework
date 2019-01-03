# App Framework 3

App Framework 3 is under development. **For production usage please use [App Framework 1](https://github.com/scriptPilot/app-framework)**. The status of the development can be seen in [this milestone](https://github.com/scriptPilot/app-framework/milestone/8). You are invited to open any V3 related [question, bug or feature request](https://github.com/scriptPilot/app-framework/issues).

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

## Contribution

### Setup

1. Run `clone https://github.com/scriptPilot/app-framework` to clone this repository
2. Run `cd app-framework` to open the repository folder
3. Run `npm install` to install all dependencies
4. Run `sudo npm link` to make CLI available in development mode

### New Feature or Bugfix

1. Create an [issue](https://github.com/scriptPilot/app-framework/issues) in GitHub
2. Create a branch with name `issue-<number>`
3. Develop and test your solution, update the documentation
4. Commit your changes on the issue branch
5. Create a pull request with note `closes issue <number>`
