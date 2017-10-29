# Setup your project

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

## Installation

Creating a new application project *my-app* is easily done in the following four steps:

1. Run `mkdir my-app` to create a new folder *my-app*
2. Run `cd my-app` to open the folder *my-app*
3. Run `echo {} > package.json` to create a *package.json* file
4. Run `npm install --save-dev app-framework` to
   - install App Framework and its dependencies
   - create the project folder structure
   - complete the *package.json* file

After the installation process finished, you should see [this folder structure](folder-structure.md).

You can run `npm run dev` to see if your new app opens in the browser.

## Update

If there is a newer version of App Framework available at the [npm repository](https://www.npmjs.com/package/app-framework), there will be an alert at the development server.

You have to update App Framework per application project by running `npm update`.

## Notes

The proper way to install the App Framework is to include it as a dev-dependency in your app's *package.json* file, i.e. it must be installed as a module, and not cloned as a repo. The *npm install* command will generate the appropriate directories in your app's root directory, and will add the relevant scripts to your app's *package.json* file.
