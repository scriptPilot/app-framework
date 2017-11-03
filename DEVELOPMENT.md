# App Framework - Development Documentation (new Version, WIP)

## Requirements

Before you develop for App Framework itself, you should be familiar how to work with App Framework in your own application. So, please follow the [end user documentation](../DOCUMENTATION.md) first.

To inform end users about wrong App Framework usage (forking instead of installing as a module), there is an error message on each script call. For App Framework development, you have to create an empty file **.enable-dev-mode** in the project folder to suppress this warning.

## Way of Working

**Changes**

1. Create an [issue](https://github.com/scriptPilot/app-framework/issues) (will be categorized as `bug`, `feature` or `improvement`)
2. Create a branch ("fix-123", "feature-123" or "improvement-123" where 123 is the issue number)
3.

## Coding Rules

- Start each JavaScript file with a `// Purpose: ...` comment
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/)
  - but without semicolons
  - but without import / export in folder **scripts**

## Architecture

App Framework code is mainly structured into **client**, **demo** and **scripts** folder.

### Client

To be continued ...

### Demo

To be continued ...

### Scripts

- Folder **scripts** contains all CLI callable scripts
- File **scripts/config.json** should contain all the default script configuration
- File **scripts/config.webpack.js** should contain all the Webpack configuration
- Files **scripts/scheme.scripts.json** and **scripts/scheme.app.json** hold the configuration schemes
- Each scripts should require first the **scripts/env.js** file with common obligatory helper:
  - `env.type(input)` - Returns a string with type of the input (string, number, array, object, null, ...)
  - `env.isInstalled` - Is `true` if App Framework is installed as Node module, else `false`
  - `env.path` - Returns absolute path with different roots, accepts no or more strings as arguments
    - `env.path.proj(...args)` - With app project folder as root
    - `env.path.app(...args)` - With app folder as root
    - `env.path.pkg(...args)` - With App Framework package folder as root
    - `env.path.client(...args)` - With App Framework client folder as root
    - `env.path.scripts(...args)` - With App Framework scripts folder as root
    - `env.path.npm(...args)` - With node_modules folder as root
    - `env.path.bin(...args)` - With node_modules/.bin folder as root
    - `env.path.cache(...args)` - With node_modules/.app-framework-cache folder as root
  - `env.cfg` - Returns content of the configuration files (not updated during script runtime)
    - `env.cfg.proj` - From project folder package.json file
    - `env.cfg.app` - From app folder config.json file
    - `env.cfg.pkg` - From App Framework package.json file
    - `env.cfg.scripts` - From App Framework scripts folder config.json file
  - `env.log` - To log messages to the console and optionally exit the script execution
    - `env.log.progress(...messages)` - Log one or more messages (all messages are transformed to strings)
    - `env.log.warning(...messages)` - Log yellow messages
    - `env.log.error(...messages)` - Log red messages and exit with error code 1
    - `env.log.issue(...messages)` - Log red messages, ask to create an issue and exit with error code 1
    - `env.log.exit(...messages)` - Log messages and exit with default code 0
    - `env.log.debug(...messages)` - Log messages only if env.cfg.app.debug is true
- Progress should be logged at the beginning of scripts with runtime > 1s and at the end of each script
