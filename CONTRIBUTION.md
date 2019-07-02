# App Framework Contribution

We are happy about any reported bug in our [issue list](https://github.com/scriptPilot/app-framework/issues).

## Development Workflow

1. Fork this repository.
2. Clone this repository to your computer.
3. Create a new branch based on an issue `feature-<issue-id>` or `fix-<issue-id>`.
4. Develop and test your solution properly.
5. Modify any affected documentation.
6. Create a pull request with a link to the issue id.

## Coding & Documentation Rules

- Name all files and folder in `lowerCamelCase`.
- Fix all code according the [Airbnb Style Guide](https://github.com/airbnb/javascript).
- Write the documentation from "us" to "you".
- Write all headlines in `Title Case`, all other text in correct orthography.
- Indicate all user inputs as `code`, all folder and file paths *italic*.
- Create all images with [Draw.io](https://www.draw.io/) and save them as XML and PNG files.

## Architecture

The **cli.js** file:

- is called on any `npx app` command by the end user
- calls on or more script files

The **scripts** files:

- are called by the *cli.js* file only
- log on any smaller successful step as "info"
- log on any bigger successful step as "success"
- log on any error with a meaningful message as "error"
- log on any error with the original message as "debug"

The **helpers** files:

- are used by the *cli.js* and *scripts* files
- provide often used functionalities and shortcuts

The **templates** files:

- are used by the *scripts/create.js* file
- provide templates for application projects

The **images** files:

- are used in markdown files *README.md* and *CONTRIBUTION.md*
