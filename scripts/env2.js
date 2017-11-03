// Purpose: Provide environment variables and helper functions to other scripts

// Import modules
const fs = require('fs-extra')
const path = require('path')
const colors = require('colors')

// Start env object
const env = {}

// Function to get the type of the input
env.type = (input) => {
  if (typeof input !== 'object') return typeof input
  else if (input === null) return 'null'
  else if (Array.isArray(input)) return 'array'
  return 'object'
}

// Installation status
env.isInstalled = fs.existsSync(path.resolve(__dirname, '../../../package.json'))

// Functions to get the absolute path starting at different roots
env.path = {
  proj: (...args) => path.resolve(__dirname, env.isInstalled ? '../../../' : '../', ...args),
  app: (...args) => path.resolve(__dirname, env.isInstalled ? '../../../app' : '../demo', ...args),
  pkg: (...args) => path.resolve(__dirname, '../', ...args),
  client: (...args) => path.resolve(__dirname, '../client', ...args),
  scripts: (...args) => path.resolve(__dirname, '', ...args),
  npm: (...args) => path.resolve(__dirname, env.isInstalled ? '../../' : '../node_modules/', ...args),
  bin: (...args) => path.resolve(__dirname, env.isInstalled ? '../../.bin/' : '../node_modules/.bin', ...args),
  cache: (...args) => path.resolve(__dirname, env.isInstalled ? '../../.app-framework-cache/' : '../node_modules/.app-framework-cache/', ...args),
}

// Load configuration files
env.cfg = {
  proj: fs.existsSync(env.path.proj('package.json')) ? fs.readJsonSync(env.path.proj('package.json')) : {},
  app: fs.existsSync(env.path.app('config.json')) ? fs.readJsonSync(env.path.app('config.json')) : {},
  pkg: fs.existsSync(env.path.pkg('package.json')) ? fs.readJsonSync(env.path.pkg('package.json')) : {},
  scripts: fs.existsSync(env.path.scripts('config.json')) ? fs.readJsonSync(env.path.scripts('config.json')) : {},
}

// Function to log messages to the console and optionally exit the script
/* eslint-disable no-console */
const log = (...args) => {
  // Check number of arguments
  if (args.length < 1) throw new Error('log() requires at minimum one message.')
  // Get messages and type
  const messages = []
  let type = null
  for (let n = 0; n < args.length; n += 1) {
    const isLastArgument = n === args.length - 1
    const value = args[n]
    if (isLastArgument && ['warning', 'error', 'issue', 'exit', 'debug'].indexOf(value) > -1) type = value
    else messages.push(value)
  }
  // Transform messages to a string
  for (let n = 0; n < messages.length; n += 1) {
    let message = messages[n]
    const msgType = env.type(message)
    if (msgType === 'object' || msgType === 'array') message = JSON.stringify(message, null, 2)
    if (msgType === 'null' || msgType === 'number') message = JSON.stringify(message)
    if (msgType === 'undefined') message = 'undefined'
    messages[n] = message
  }
  // Log message to console
  if (type !== 'debug' || env.cfg.app.debug) {
    const consoleMessage = messages.join('\n')
    if (type === 'error' || type === 'issue') console.log(colors.red.bold(consoleMessage))
    else if (type === 'warning') console.log(colors.yellow.bold(consoleMessage))
    else console.log(colors.bold(consoleMessage))
    if (type === 'issue') {
      console.log('Please open an issue on GitHub:')
      console.log(colors.blue.underline('https://github.com/scriptPilot/app-framework/issues'))
    }
  }
  // Exit script
  let exitCode = null
  if (type === 'error' || type === 'issue') exitCode = 1
  else if (type === 'exit') exitCode = 0
  if (exitCode !== null) process.exit(exitCode)
}
/* eslint-enable no-console */

// Attach log functions to env object
env.log = {
  progress: (...messages) => log(...messages),
  warning: (...messages) => log(...messages, 'warning'),
  error: (...messages) => log(...messages, 'error'),
  issue: (...messages) => log(...messages, 'issue'),
  exit: (...messages) => log(...messages, 'exit'),
  debug: (...messages) => log(...messages, 'debug'),
}

// Export env object
module.exports = env
