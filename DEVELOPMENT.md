# App Framework - Development

> This document is only for the developers of App Framework.

> If you want to use App Framework, please read our end user [Documentation](DOCUMENTATION.md).

- [Way of working](#way-of-working)
- [CLI commands](#cli-commands)
- [Folder structure](#folder-structure)
- [Rules](#rules)
- [Script files](#script-files)

## Way of working

1. Create a branch (for example "dev-1.4")
2. Proceed issues
   - Develop
   - Test
   - Document
   - Commit changes with closure reference to the issue
3. Merge branch

## CLI commands

To inform end users about wrong App Framework usage (forking instead of installing as a module), there is an error message on each *env.js* script call. For App Framework development, you have to create an empty file *.enable-dev-mode* in the project folder to suppress this warning.

Additional development CLI commands:

- `npm run reset` - Reset cache folder
- `npm run f7` - Build and update Framework7 and both kitchen sinks (must exist on same level as app-framework folder)
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
├── config-scheme.json          # Scheme for any application configuration file
├── DEVELOPMENT.md              # Development documentation
├── DOCUMENTATION               # End user documentation
├── env.js                      # Object with environment variables
├── index.ejs                   # Template for the build index file
├── LICENSE                     # App Framework license file
├── package.json                # App Framework project information
└── README.md                   # Features, Quick start, upcoming and completed milestones
```
## Rules

Code must be checked on build automatically according [Standard JS rules](http://standardjs.com/).

### Folder and file naming

Lowercase and hyphen type, example: *folder/sub-folder/file-in-sub-folder.js*

### File structure

1. Notice about purpose: `/* Purpose: ... */`
2. Strict mode: `'use strict'`
3. Include components:
   - ./env (alphabetically sorted)
   - ./lib/... (alphabetically sorted)
   - npm modules (alphabetically sorted
4. Define steps (functions, mixins)
5. Componse steps

### Comments

- Logic blocks are to comment before with `// Next block action`
- For tests, code should be comment out with `/* ... */`

### Coding rules

- Use absolute path names
- Use camelCase for all names in code (variables, functions, ...)
- Provide solutions on error messsages
- Prefer asynchronious functions
- Do not use short hand methods (for better readability)

## Script files

A script file executes some code and use *lib/alert* to show either a success message or an error message as result. The script could be split up in single steps, arranged with nested callbacks.

- Each step should indicate the run with an alert `<step> ongoing - please wait ...`
- Each step should indicate a successful run with `<step> done.`
- Each step should indicate a failed run with `Error: <step> failed. <solution>`
