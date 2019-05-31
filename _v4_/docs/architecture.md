# Architecture

## Build Flow

![Build Flow](./images/buildFlow.png)

## Folder Structure

```
├── .git/                        # Git managed folder (do not modify)
├── app/                         # App files
|   ├── components/                - Custom Vue components (optional)
|   ├── lang/                      - Language files (optional)
|   ├── pages/                     - Framework7    -Vue single file components (optional)
|   ├── app.vue                    - App component (entry point of any application)
|   ├── config.json                - App configuration file
|   └── routes.json                - Framework7    -Vue routes file (optional)
├── build/                       # Latest build files (do not modify)
├── cache/                       # Cache folder (do not modify)
├── docs/                        # Documentation files
|   └── images/                    - Documentation image files
├── framework/                   # App Framework core files
|   ├── mixins/                    - Vue mixins
|   ├── scripts/                   - Scipts (composed by the CLI)
|   ├── appScriptTemplate.js       - app.js mustache template
|   ├── cli.js                     - CLI program
|   ├── configSchema.json          - App config schema
|   └── indexFileTemplate.html     - index.html mustache template
├── node_modules/                # Node modules folder (do not modify)
├── .eslintrc.json               # ESLint default configuration
├── .gitignore                   # Gitignore config file
├── CHANGELOG.md                 # Release changelog
├── LICENSE                      # App Framework license file
├── package.json                 # App Framework project information
└── README.md                    # Documentation entry page
```
