# Deploy your application

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

App Framework does many adjustments in the background to enable you to deploy your App easily as Web App or as native App. So you could start fast and become professional later on without any change. But what are the differences?

## Comparison between Web App and Native App

| &nbsp; |Web App|Native App|
|---|---|---|
|Installation|Are running in the device browser and could be pinned to the homescreen.|Are installed from an App Store or manually to the device (Android only).|
|Performance|Reload on reopen, but could be cached for offline usage. Offline warning.|Kept in runtime of the device, smoother usage. No offline warning.|
|Capability|Only browser features.|Access to the device hardware and OS features.|
|Deployment|In seconds.|Additional native build plus approval process, which takes some time and could be refused at the Apple App Store.|
|Costs|Firebase hosting service is free for small apps.|Apple App Store requires developer program (around 99€ per year), Google Play store requires registration fee (around 25 USD once). For selling apps, Apple and Google charge around 30% of the sales.|
|Promotion|All regular ways.|All regular ways plus special promotions and user ratings in the store.|

## Deployment to a FTP server (Web App)

- Run `npm run ftp` to deploy your latest build to your FTP server, on first call, the config file *ftp-config.json* is created automatically and you have to update it with your FTP server data
- For rollback, run `npm run ftp -- --version x.y.z`

## Deployment to Firebase Hosting (Web App)

- Run `npm run firebase` to deploy your latest build, database rules and storage rules to [Firebase Hosting](https://firebase.google.com/products/hosting/)
- Run `npm run database` to deploy your latest build database rules to Firebase
- Run `npm run storage` to deploy your latest build storage rules to Firebase
- Run `npm run hosting` to deploy your latest build static files to Firebase
- For rollback, run all the commands above and extend with ` -- --version x.y.z` or use the Firebase Console

## Deployment to the Apple App Store (native App)

### Requirements

- You need a Mac with [macOS](http://www.apple.com/de/macos/) and installed [Xcode](https://developer.apple.com/xcode/) (free)
- You need to sign to the [Apple developer program](https://developer.apple.com/programs/) (around 99€ per year)

### Preparation

- Create a production certificate in iTunes Connect, download and install it on your Mac
- Create a distribution provisioning profile in iTunes Connect, download and install it on your Mac
- Create a new App in [iTunes Connect](https://itunesconnect.apple.com/)
- Configure the SKU from iTunes Connect in the configuration file as `appStoreId`

### Deployment

- You need to prepare the publishing in [iTunes Connect](https://itunesconnect.apple.com/)
- Run `npm run xcode` to create a project file for Xcode, based on [Cordova](https://cordova.apache.org/)
- Make screenshots on the biggest iPhone (you will need them in iTunes Connect later on)
- Deactivate automatic managed signing, select your certificate and provisioning profiles created before
- Select the Generic iOS Device
- Create an archive (Product > Archive) of the Xcode project and upload it to iTunes Connect
- Send your App in iTunes Connect for the review to Apple

### Rollback
- For rollback, run `npm run xcode -- --version x.y.z` or use iTunes Connect

## Deployment to the Google Play Store (native App)

### Requirements

- You need to install the [Android Studio](https://developer.android.com/studio/)
- You need to register at the [Google Play Developer Console](https://play.google.com/apps/publish/signup/) (around 25 USD once)

### Preparation

- Create a new App in the [Google Play Developer Console](https://play.google.com/apps/publish)
- Configure the app ID in the configuration file as `playStoreId`

### Deployment

- Run `npm run studio` to create a project file for Android Studio, based on [Cordova](https://cordova.apache.org/)
- Select your project and confirm Gradle sync
- Make screenshots, you will need them later in the Google Play Developer Console
- Generate signed APK
- Deploy your application from the Google Play Developer Console

### Rollback

- For rollback, run `npm run studio -- --version x.y.z` or use the Google Play Developer Console
