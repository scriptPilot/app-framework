# App Framework v4

> App Framework v4 is still under development. The latest stable version is [App Framework v1](https://github.com/scriptPilot/app-framework/blob/v1/README.md).

App Framework combines great pieces of open source code, to do all the tasks for you, which are required to create and build applications based on HTML, CSS and JavaScript for multiple platforms.

&nbsp;

![Development Process](docs/images/process.png)

&nbsp;

## Why?

- [ ] You can create new application projects in seconds.
- [ ] You can use your favorite frameworks and libraries.
- [ ] You never have to worry about build processes again.
- [ ] You never have had such a tidy project folder before.
- [ ] App Framework is free and open source.

## Features

- [ ] **Project Folder Creation** - lightweight and well-organized.
- [ ] **Powerful JavaScript Frameworks** - like Angular, React, Vue or your favorite one.
- [ ] **Beautiful UX Frameworks** - like Material Design, Bootstrap, SAP UI5, Framework7 or your favorite one.
- [ ] **Comprehensive Icon Fonts** - use Material Design Icons, Framework7 iOS Icons, Font Awesome or any other.
- [ ] **Native Hardware APIs** - supported by Capacitor and Cordova.
- [ ] **Development Server** - with live reload in the web browser or an Electron shell.
- [ ] **Automated Code Fix** - with ESLint according the Airbnb Style Guide, Standard JS or your own rules.
- [ ] **Asset Generation** - for icons, splash screens, the manifest, the robots file and service worker.
- [ ] **Optimized Build Process** - to get excellent scores at Lighthouse and other audits.
- [ ] **Multiple Build Targets** - as PWA, mobile (iOS, Android) or desktop application (macOS, Windows, Linux).
- [ ] **Automated Deployment** - to any FTP server or Firebase.

## CLI Commands

**Create** a new application project:

```
npx app-framework
```

**Start** the development server:

```
npx app dev               # as configured
npx app dev web           # in the web browser
npx app dev electron      # in an Electron shell
```

**Build** your application:

```
npx app build             # as configured
npx app build pwa         # as PWA only
npx app build ios         # as Xcode project only
npx app build android     # as Android Studio project only
npx app build macos       # as macOS application only
npx app build windows     # as Windows application only
npx app build linux       # as Linux application only
```

**Deploy** your application:

```
npx app deploy            # as configured
npx app deploy ftp        # to an FTP server only
npx app deploy firebase   # to Firebase only
```
