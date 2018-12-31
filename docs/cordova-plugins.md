# Cordova plugins

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

## Configuration

App Framework supports well the usage of Cordova / PhoneGap plugins. You just have to add them in the configuration file. Example with [cordova-plugin-badge](https://github.com/katzer/cordova-plugin-badge):

```
useCordovaPlugins: [
  "cordova-plugin-badge"
]
```

## Usage

You can use the plugin now in any of your components. Example:

```
<script>
  export default {
    created: function () {
      // Set badge to 10
      window.cordova.plugins.notification.badge.set(10)
    }
  }
</script>
```

Take care to use `window.` to access any plugin.

## Plugin repository

You find a list of available plugins here: [https://cordova.apache.org/plugins](https://cordova.apache.org/plugins)

## Default plugins

By default, [cordova-plugin-whitelist](https://github.com/apache/cordova-plugin-whitelist) and [cordova-plugin-statusbar](https://github.com/apache/cordova-plugin-statusbar) are included in the build.

To simplify the usage, App Framework provides you an easier way to manipulate the status bar - please read the chapter [Status bar style](status-bar-style.md) for details.

## Availability

Cordova plugins are only available in native applications or emulators, in the browser, they are undefined.
