# Extend the Vue / Framework7 root object

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

In some cases you want to extend the Vue or Framework7 root object. To make App Framework easier for most of the users, the root object is handled in the background. But for advanced users, there is a simple way to extend the root object.

All you have to do, is to create a *app/vue.js* file, which exports a function with one parameter (the Vue object) and returns the modified Vue object:

```
module.exports = (vue) => {

  // Example modification
  vue.mixin({
    created () {
      console.log('Custom Vue extension works!')
    }
  })

  return vue
}
```

App Frameworks detects that file automatically, there is no need for further configuration.

After creating or deleting the *vue.js* file, you have to run again `npm run dev` to update the dev server.

## Overwrite Framework7 options

In this file you can modify the [Framework7 initialization parameters](http://framework7.io/docs/init-app.html) as well. As an example, we overwrite the `preroute()` function.

```
// Export function with Vue object as argument
module.exports = (vue) => {
  // Add mixin
  vue.mixin({
    // Add created() hook
    created() {
      // Apply only for root element
      if (this === this.$root) {
        // Overwrite Framework7 preroute
        this.$options.framework7.preroute = (view, options) => {
          // Log view and options
          console.log(view)
          console.log(options)
          // Stop further page load
          return false
        }
      }
    },
  })
  return vue
}
```
