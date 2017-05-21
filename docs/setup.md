# Setup your project

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

Creating a new application project is easily done in the following three steps:

1. Create an empty project folder
2. Create a **package.json** file in it with the following content:

   ```
   {
     "name": "my-app",
     "version": "1.0.0",
     "devDependencies": {
       "app-framework": "*"
     }
   }
   ```

3. Run `npm install` to install *App Framework* and setup the project folder

If there is a newer version of App Framework available at the [npm repository](https://www.npmjs.com/package/app-framework), there will be an alert at the development server.

You have to update App Framework per application project by running `npm update`.
