# Project folder structure

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

The following project folder will be created by default:

```
├── app/                        # App source folder
│   ├── images/                 # App images
│   ├── lang/                   # App language files
│   ├── pages/                  # App page components
│   ├── app.vue                 # App main component
│   ├── config.js               # App configuration
│   ├── firebase-database.json  # Firebase database rules
│   ├── firebase-storage.txt    # Firebase storage rules
│   ├── icon.png                # App icon file (minimum size is 1024 pixel)
│   └── routes.json             # App routes configuration
├── build/                      # Latest build files (created after first build, do not modify)
├── design/                     # Design templates (PDF, Power Point)
├── node_modules/               # Installed node modules (do not modify)
├── snapshots/                  # Project snapshots (for rollback)
├── .babelrc                    # Babel configuration file for ES2015 support (do not modify)
├── .gitignore                  # List of ignored files for Git commits (do not modify)
├── .npmignore                  # List of ignored files for NPM publishing (do not modify)
├── package-lock.json           # Installation information (do not modify)
└── package.json                # Project information
```

You can reset your application folder with `npm run reset-app` - but be careful, this will delete your current *app* folder!
