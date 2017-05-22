# Test your application

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

## Development server

Run `npm run dev` to start the development server in the web browser. With `CTRL + C`, you stop the development server.

If the web browser does not open automatically, you have to visit http://localhost:8080 manually.

The default port 8080 could be configured with *devServerPort*.

## iOS emulator

Run `npm run ios` to open an iOS emulator with a development build.

The iOS emulator requires a macOS device (iMac, macBook, ...) and installed Xcode - please read the chapter [Software requirements](software.md) for details.

To change the default emulator, you have to open Xcode and configure the default deployment target.

## Android emulator

Run `npm run android` to open an Android emulator with a development build.

Confirm Gradle sync and removal of older application installations if asked.

If you get an error *Failed to find 'JAVA_HOME' environment variable*, you have to install the Java SE SDK first.

The Android emulator requires installed Android Studio - please read the chapter [Software requirements](software.md) for details.

To change the default emulator, you have to open Android Studio and configure the default deployment target.

## Own device

To install and test your application on your own device, you have to follow these steps:

1. Build your application, for example with `npm run patch`
2. Run `npm run xcode` or `npm run studio` to deploy your build to Xcode or Android Studio
3. Connect your own device to your computer
4. Configure your own device as deployment target in Xcode or Android Studio
5. Deploy the application to your device with Xcode or Android Studio

## Code fix

App Framework fix your code automatically on each test or build command. To disable this behavior, you can set the configuration parameter *fixCodeOnBuild* to false. If some findings could not be fixed automatically, they will be logged to *code-findings.log* file.

## Development Firebase rules

On each development command, the Firebase database rules are deployed, if *devFirebase.deployDevRulesOnTesting* is true and *devFirebase.databaseURL* is not empty.

On each development command, the Firebase storage rules are deployed, if *devFirebase.deployDevRulesOnTesting* is true and *devFirebase.storageBucket* is not empty.
