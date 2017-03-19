# App Framework - Development

> This document is only for the developers of App Framework.

> If you want to use App Framework, please read our end user [Documentation](DOCUMENTATION.md).

**Table of contents**

- [CLI commands](#cli-commands)
- [Folder structure](#folder-structure)
- [Coding rules](#coding-rules)
- [Script files](#script-files)

## CLI commands

To inform end users about wrong App Framework usage (forking instead of installing as a module), there is an error message on each *env.js* script call. For App Framework development, you have to create an empty file *.enable-dev-mode* in the project folder to suppress this warning.

Additional development CLI commands:

- `npm run reset` - Reset cache folder
- `npm run f7` - Build and update Framework7 (must exist on same level as app-framework folder)
- `npm run f7vue` - Build and update Framework7-Vue (must exist on same level as app-framework folder)

## Folder structure

```
├── app                         # Demo App project folder
├── build                       # Lates build files
├── design                      # Design templates (PDF and PPTX)
├── lib                         # Own modules
├── media                       # Graphics for documentation and promotion
├── node_modules                # Installed node modules (do not modify)
├── scripts                     # Scripts, defined in package.json
├── vendor                      # Vendor files
├── .babelrc                    # Babel configuration file
├── .gitignore                  # List of ignored files for Git commits
├── DEVELOPMENT.md              # Development documentation
├── DOCUMENTATION               # End user documentation
├── env.js                      # Object with environment variables
├── index.ejs                   # Template for the build index file
├── LICENSE                     # App Framework license file
├── main.css                    # Common CSS file for bug-fixes and phone frame
├── package.json                # App Framework project information
└── README.md                   # Features, Quick start, upcoming and completed milestones
```
# Coding rules

- Code files must start with a description of their purpose `/* Purpose: This at the very beginning ... */`
- After the description, code must be set to strict mode with `use strict`
- Code must be commented well with `// Next block action` before any logic block
- Modules must be loaded in the order *./env, ./lib/.., <npm>*, then alphabetically by module
- Use always absolute paths
- Comment out for tests with `///`
- Comment thing to do with `///tbc`
- Code must be checked automatically according [Standard JS rules](http://standardjs.com/) on build
- Asynchronous functions should be preferred
- Function results should be checked
- On error alerts, a solution should be provided
- Hyphen-type and lower case for folder and file names
- Camel-case for all names in coding
- For better readability, shorthands should not be used

## Script files

A script file executes some code and use *lib/alert* to show either a success message or an error message as result. The script could be split up in single steps, arranged with nested callbacks.

- Each step should indicate the run with an alert `<step> ongoing - please wait ...`
- Each step should indicate an successful run with `<step> done.`
- Each step should indicate an failed run with `Error: <step> failed. <solution>`
