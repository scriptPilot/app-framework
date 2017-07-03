# Status bar style

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

## Configuration

You can configure the application status bar style in the configuration file:

```
statusbarVisibility: true,                               // true or false
statusbarTextColor: 'white',                             // 'black' or 'white'
statusbarBackgroundColor: '#3f51b5',                     // Hex color code
```

**changeStatusbarBackgroundColorOnThemeColorChange**

This configuration option was removed with App Framework 1.9.15. You can apply the following code to your *app.vue* file to have the same behavior:

```
created() {
  // Update status bar background and text color after theme color change
  this.$watch(() => {
    return this.$root.color
  }, (newColor, oldColor) => {
    this.$root.statusbarTextColor = newColor === 'white' ? 'black' : 'white'
    this.$root.statusbarBackgroundColor = newColor === 'white' && window.cordova === undefined ? '000000' : this.$root.colors[this.$root.theme][newColor]
  })
}
```

## Runtime modification

You can modify the application status bar style in any Vue hook `created` or later:

```
created: function () {
  this.$root.statusbarVisibility = true
  this.$root.statusbarTextColor = 'white'
  this.$root.statusbarBackgroundColor = '#3f51b5'
}
```

The current style is restored after application restart and overwrites the configuration.

## Limitations

- Changing the status bar visibility is limited to native applications
- Changing the status bar text color is limited to iOS native applications
- Changing the status bar background color is limited to native or homescreen applications
