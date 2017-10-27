# ESLint code checks

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

The code is checked with ESLint. You can apply your own configuration easily in the *app/config.json* file. The *.eslintrc* file will be updated before each test according your configuration.

The new default configuration:

```
"eslint": {
  "extends": "airbnb",
  "rules": {
    "semi": [
      "error",
      "never"
    ]
  }
}
```

The old default configuration:

```
"eslint": {
  "extends": "standard",
  "rules": {}
}
```

Currently, `airbnb` and `standard` are available to extend - if you wish to extend another shared configuration, please ask for it in our [issue list](https://github.com/scriptPilot/app-framework/issues).
