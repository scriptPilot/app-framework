# Coding rules

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

The following rules should be followed for all changes. Please keep in mind that the current code base could still look different in some cases.

## File naming

All folder, files and its extensions should be named lowercase, hyphen-type and only with numbers and alphabetic characters.

Example: *folder/sub-folder/file-in-sub-folder.js*

## File structure

In general, the file structure should be as following:

1. Purpose as notice
2. Strict mode declaration
3. Used modules
   - local modules, sorted by path name
   - npm modules, sorted by name
4. Single steps
5. Execution

Example:

```
// Purpose: Demonstration file for the development documentation

'use strict'

// Require modules
let moduleA = require('./aFolder/aModule')
let moduleC = require('./aFolder/cModule')
let moduleB = require('./bFolder/bModule')
let lodash = require('lodash')

// Define single steps
function stepA (callback) {
  ...
  callback()
}
function stepB () {
  ...
}

// Run script
stepA(function () {
  stepB()
})
```

## Comments

All logic code blocks should be commented well with `// ...` before. Example:

```
// Define list with names
let names = ['Tom', 'Susi', 'Aaron']
// List with names is an array
if (Array.isArray(names)) {
  // Loop list with names
  for (let n = 0; n < names.length; n++) {
    // Print name to console
    console.log('Name no. ' + (n + 1) + ' is ' + names[n])
  }
// List with names is no array
} else {
  // Print error to console
  console.error('List with names is no array')
}
```

All disabled code blocks for tests should be commented out with `/* ... */`. All additional code blocks for tests should be indicated with `/* test */`. Example:

```
// Define list with names
/*
let names = ['Tom', 'Susi', 'Aaron']
*/
let names = 'everything but no array' /* test */
...
```

## Airbnb JavaScript rules

All code is checked according [Airbnb JavaScript rules](https://github.com/airbnb/javascript) (but without semicolons) before each build.

## Naming in code

- Variables: noun, self-explaining, camelCase (`userList`, `userListSorted`)
- Functions: verb, self-explaining, camelCase (`deleteUser`, `sortUserList`)
- Classes: noun, self-explaining, camelCase, first letter uppercase (`User`, `UserList`)

## Error messages

You should always consider wrong input data and possible errors and react with an error message. In addition, you should provide a solution. If the root cause is not known or the user is not accountable, you should ask him "Please create an issue on GitHub".

## Script files

All scripts, mainly called by `npm run ...`, should indicate the steps by a status alert, shown in the command line tool. Further output should be avoided.

Therefore, you could use the *scripts/alert.js* function with `let alert = require('./alert')`.

- Use `alert('<step> ongoing - please wait ...')` to indicate the begin of each step
- Use `alert('<step> done.')` to indicate the successful end of each step
- Use `alert('<step> failed. <solution>', 'exit')` to indicate the unsuccessful end of each step and exit further script execution
- Use `alert('<step> failed.', 'issue')` as a shorthand to indicate the unsuccessful end of each step, exit further script execution and attach a request to open an issue on GitHub

Example:

```
// Purpose: Demonstration file for alerts in script files

'use strict'

// Require modules
let alert = require('./alert')

// Define single steps
function stepA (callback) {
  alert('StepA ongoing - please wait ...')
  ...
  if (success) {
    alert('StepA done.')
    callback()
  } else {
    alert('StepA failed. Please do this or that.', 'error')
  }
}
function stepB (callback) {
  alert('StepB ongoing - please wait ...')
  ...
  if (success) {
    alert('StepB done.')
    callback()
  } else {
    alert('StepB failed.', 'issue')
  }
}

// Run script
stepA(function () {
  stepB(function () {
    alert('<script objective> done.')
  })
})
```
