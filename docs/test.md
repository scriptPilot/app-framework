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

To change the default emulator, you have to open Android Studio and configure the default deployment target at *Tools > Android > AVD Manager*.

## Own device

To deploy to your iOS device:

1. Build your application with `npm run patch/minor/major` (see chapter [Build your application](build.md))
2. Connect your device to your computer
3. Deploy the latest build to Xcode with `npm run xcode`
4. Select a team at Signing section
5. Select your device as deployment target
6. Deploy to your device

To deploy to your Android device:

1. Build your application with `npm run patch/minor/major` (see chapter [Build your application](build.md))
2. Connect your device to your computer
3. Deploy the latest build to Android Studio with `npm run studio`
4. Select your device as deployment target
5. Deploy to your device

## Code fix

App Framework fixes your code automatically on each test or build command.

To disable this behavior, you can set the configuration parameter *fixCodeOnBuild* to false.

If some findings could not be fixed automatically, they are logged to *code-findings.log* file.

## Development Firebase rules

On each test command, the Firebase database rules are deployed, if *devFirebase.deployDevRulesOnTesting* is true and *devFirebase.databaseURL* is not empty.

On each test command, the Firebase storage rules are deployed, if *devFirebase.deployDevRulesOnTesting* is true and *devFirebase.storageBucket* is not empty.

Please read the chapter [Firebase backend](firebase.md) for details.
