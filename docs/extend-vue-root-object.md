# Extend the Vue root object

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

In some cases you want to extend the Vue root object. To make App Framework easier to most of the people, the root object is handled in the background. But for advanced users, there is a simple way to extend the root object.

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
