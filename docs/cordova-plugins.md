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
      cordova.plugins.notification.badge.set(10)
    }
  }
</script>
```

## Plugin repository

You find a list of available plugins here: [https://cordova.apache.org/plugins](https://cordova.apache.org/plugins)

## Default plugins

By default, *cordova-plugin-whitelist* and *cordova-plugin-statusbar* are included in the build.

To simplify the usage, App Framework provides you an easier way to manipulate the status bar - please read the chapter [Status bar style](status-bar-style.md) for details.
