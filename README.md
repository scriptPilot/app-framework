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
  - `npx app test eslint` to run ESLint test
  - `npx app test jest` to run Jest tests
- `npx app dev` to open application on development server
- `npx app build` to build application according configuration
- `npx app deploy ftp` to deploy the PWA to any FTP server
- `npx app deploy firebase` to deploy the PWA to any FTP server

## Update

Run `npm update` to update to latest development version.

## Contribution

### Setup the Development Environment

- [GitHub Desktop](https://desktop.github.com/) to manage GitHub repositories
- [Atom](https://atom.io/) as a code editor
  - Package `language-vue-component` for [Vue single file component](https://vuejs.org/v2/guide/single-file-components.html)
  - Package `editorconfig` to have same file formatting settings
- [Node.js](https://nodejs.org) as a local development server
- [Google Chrome](https://www.google.de/chrome) as a web browser with integrated [development tools](https://developers.google.com/web/tools/chrome-devtools/)
  - Extension [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) to debug the Vue components

### Setup the Repository

1. Run `clone https://github.com/scriptPilot/app-framework` to clone this repository
2. Run `cd app-framework` to open the repository folder
3. Run `npm install` to install all dependencies
4. Run `sudo npm link` to make CLI available in development mode

### Development Workflow

1. Create an [issue](https://github.com/scriptPilot/app-framework/issues) in GitHub
2. Create a branch with name `issue-<number>`
3. Develop and test your solution, update the documentation
4. Commit your changes on the issue branch
5. Create a pull request with note `closes issue <number>`

Please follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

### Release Workflow

1. Commit all changes
2. Update the changelog file for the next version
3. Run `npm publish` to start the publishing process
  -
