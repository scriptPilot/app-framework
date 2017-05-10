# Test your application

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

- Run `npm run dev` to start the development server in the web browser
  - `CTRL + C` to stop the development server
- Run `npm run ios` to open an iOS simulator with a development build
- Run `npm run android` to open an Android simulator with a development build

  Confirm Gradle sync and removal of older application installations if asked.

  If you get an error *Failed to find 'JAVA_HOME' environment variable. Try setting setting it manually.* you have to install the Java SE SDK first.

App Framework fix your code automatically on each test or build command. To disable this behavior, you can set the config parameter *fixCodeOnBuild* to false. If some findings could not be fixed automatically, they will be logged to *code-findings.log*.

If *dev-firebase* is configured in *config.json* file, on each test command, the Firebase database and storage rules are deployed automatically.
