# App Framework - CLI commands

> First contact with App Framework? Please read the [Readme file](README.md) first!

**Setup**

- `npm install` to install *App Framework* and setup project folder
- `npm update` to update *App Framework* to latest sub version

**Testing**

- `npm run dev` to start development server with live reload
- `npm run ios` to open iOS simulator
- `npm run android` to open android emulator

**Building**

- `npm run patch` to build app after bug-fixes and improvements
- `npm run minor` to build app after adding new functionality
- `npm run major` to build app after breaking backward-capability

**Deployment**

- `npm run firebase` to deploy build to Firebase
  - `npm run database` to deploy only database rules to Firebase
  - `npm run storage` to deploy only storage rules to Firebase
  - `npm run hosting` to deploy only static files to Firebase
- `npm run ftp` to deploy build to FTP server
- `npm run xcode` to open build in Xcode
- `npm run studio` to open build in Android Studio

All deployment commands support `--version x.y.z` parameter for rollback.
