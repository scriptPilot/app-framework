# App Framework - Development

> This document is only for the developers of App Framework.

> If you want to use App Framework, please read our [Documentation](DOCUMENTATION.md).

**Table of contents**

- [CLI commands](#cli-commands)
- [Folder structure](#folder-structure)
- [Coding rules](#coding-rules)
- [Lib files](#lib-files)
- [Script files](#script-files)

## CLI commands

To inform end users about wrong App Framework usage (forking instead of installing as module), end user scripts must be run with parameter `--force` (or short `-f`) in development mode to run them with the demo app.

## Folder structure

```
├── demo                        # Demo App project folder
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

## Lib files

A lib file exports a function an throws errors on error.

## Script files

A script file executes some code and use *lib/alert* to show either a success message or an error message as result. The script could be split up in single steps, arranged with nested callbacks.

- Each step should show the progress with an alert `<step> ongoing - please wait ...`
- Each step should indicate an successful run with `<step> done.`
- Each step should indicate an failed run with `Error: <step> failed. <solution>`
