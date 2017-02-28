# App Framework - Development

> This document is only for the developers of App Framework.

> If you want to use App Framework, please read our [Documentation](DOCUMENTATION.md).

**Table of contents**

- [Folder structure](#folder-structure)
- [Script files](#script-files).

## Folder structure

```
├── .cache                      # Cache folder (do not modify)
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
├── index.ejs                   # Template for the build index file
├── LICENSE                     # App Framework license file
├── main.css                    # Common CSS file for bug-fixes and phone frame
├── package.json                # App Framework project information
└── README.md                   # Features, Quick start, upcoming and completed milestones
```

## Script files

- Should use *lib/cmd* to run scripts asynchronously
- Should use *lib/alert* to show information about progress
  - Should abort script execution on error with `alert('Error: ...')` or `alert('Message ...', 'error')`
