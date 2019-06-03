# App Framework Architecture

## Executable

The file *cli.js*.

- is executed on the initial `npx app-framework` command by the end-user
- is executed on any `npx app ...` command by the end-user
- is calling one or more scripts per command

## Scripts

All files in folder *scripts*.

- are called by the executable only
- are using the log helper to log frequently on the progress
- are using the log helper to log original errors in debug mode only
- are using the log helper to handle errors with helpful log and 
- suppress original error messages but use the logger to end with helpful error message

## Helper

All files in folder *scripts/helper*.

- are imported by the script files
- providing supporting functionality and shortcuts

## Templates

All files in folder *templates*.

- are used by the create and build scripts
- are providing
