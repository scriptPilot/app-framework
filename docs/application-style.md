# Application style

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

## Configuration

You can set the following style options in the configuration file:

```
theme: 'material',                           // 'ios', 'material', 'ios-material' or 'material-ios'
color: 'indigo',                             // Any theme color name
layout: 'default'                            // 'default', 'white' or 'dark'
limitApplicationWidth: 320,                  // Pixel
limitApplicationHeight: 570,                 // Pixel
limitedSizeBodyBackgroundColor: '#333333',   // HEX color code
showPhoneFrameOnDesktop: true,               // true or false
phoneFrameBodyBackgroundColor: '#fafafa',    // HEX color code
framework7parameters: {}                     // Object, see Framework7 documentation
```

If you want to change the theme during runtime, you need to use `ios-material` or `material-ios` as value in the configuration. With `ios-material`, the default theme will be ios, but you are able to change the theme to `material`, with `material-ios` in the configuration vice versa.

You will reduce the build size if you configure either `ios` or `material`.

Find more information about all theme color and layout options [here](http://v1.framework7.io/docs/color-themes.html).

## Runtime modification

You can modify the style options during runtime in any Vue hook `created` or later:

```
created: function () {
  this.$root.theme = 'material'
  this.$root.color = 'indigo'
  this.$root.layout = 'default'
}
```
The current style is restored after application restart and overwrites the configuration.
