# App Framework Contribution

We are happy about any reported bug in our [issue list](https://github.com/scriptPilot/app-framework/issues).

## Development Workflow

1. Fork this repository.
2. Clone this repository to your computer.
3. Run `npm link` to make the CLI locally available (may require `sudo`)
4. Create a new branch based on an issue `feature-<issue-id>` or `fix-<issue-id>`.
5. Develop and test your solution properly.
6. Modify any affected documentation.
7. Create a pull request with a link to the issue id.

## Coding & Documentation Rules

- Name all folders and files in `lowerCamelCase`.
- Fix all code according the [Airbnb Style Guide](https://github.com/airbnb/javascript).
- Describe the purpose and comment well in all code files.
- Write the documentation from "us" to "you".
- Write all headlines in `Title Case`, all other text in correct orthography.
- Indicate all user inputs as `code`, all folder and file paths *italic*.
- Create all images with [Draw.io](https://www.draw.io/) and save them as XML and PNG files.

## Dependency Management

To avoid issues in the applications after dependency updates, App Framework v4 is different to v1:

- all dependencies which are required to create the project folder or build the application are managed within App Framework
- all dependencies which are required to test the project or are part of the application itself are managed in the application project

## Architecture

The **cli.js** file:

- is called on the `npx app-framework` and any `npx app ...` command by the end user
- calls one or more script files

The **scripts** files:

- are called by the *cli.js* file only
- log on any smaller successful step as "info"
- log on any bigger successful step as "success"
- log on not optimal situations as "warning"
- log on any error with a meaningful message as "error"
- log on any error with the original message as "debug"
- exit further script execution on any error

The **helpers** files:

- are used by the *cli.js* and *scripts* files
- provide often used functionalities and shortcuts

```     
// Get absolute paths
path.framework()
path.cache()
path.scripts()
path.templates()
path.project()
path.app()

// Log to the console (requires path)
log.debug()
log.info()
log.success()
log.warning()
log.error()
log.reset()

// Run CLI commands (requires path and log)
run.silent()        
run.loud()          
run.script()  

// Merge objects
merge()
```

The **templates** files:

- are used by the *scripts/create.js* file
- provide templates for new application projects

The **images** files:

- are used in markdown files *README.md* and *CONTRIBUTION.md*
