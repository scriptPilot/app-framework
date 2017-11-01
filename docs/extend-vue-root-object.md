# Extend the Vue / Framework7 root object

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

In some cases you want to extend the Vue or Framework7 root object. To make App Framework easier for most of the users, the root object is handled in the background. But for advanced users, there is a simple way to extend the root object.

All you have to do, is to create a ***app/vue.js*** file, which exports a function with one parameter (the Vue object) and returns the modified Vue object:

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

After creating or deleting the *app/vue.js* file, you have to run again `npm run dev` to update the dev server.

## Own components

You can easily create your own reusable Vue components, which are available in the app and all pages later on.

1. Create the *app/vue.js* file with basic content
   ```
   module.exports = (vue) => vue

   ```
2. Create the component *app/components/customButton.vue*
   ```
   <template>
     <f7-button @click="handleCustomButtonClick" raised fill>Custom Button</f7-button>
   </template>
   <script>
     export default {
       methods: {
         handleCustomButtonClick () {
           this.$f7.alert('Yeah, you clicked the button!')
         }
       }
     }
   </script>
   ```
3. Add the component in your *app/vue.js* file
   ```
   const customButton = require('./components/customButton.vue')
   
   module.exports = (vue) => {
     vue.component('custom-button', customButton)
     return vue
   }
   ```
4. Integrate the component in any page or the app component
   ```
   <template>
     <f7-page>
      <f7-block>

        <!-- here it is! -->
        <custom-button />

      </f7-block>
    </f7-page>
   </template>
   ```

As you can see, all the Framework7 elements are available for your own component.

## Overwrite Framework7 options

In this file you can modify the [Framework7 initialization parameters](http://framework7.io/docs/init-app.html) as well. As an example, we overwrite the `preroute()` function.

```
module.exports = (vue) => {

  // Add modification as mixin with created() hook
  vue.mixin({
    created() {

      // Check for root element
      if (this === this.$root) {

        // Overwrite Framework7 preroute
        this.$options.framework7.preroute = (view, options) => {
          console.log(view)
          console.log(options)
          console.log('No further page load now ...')
          return false
        }

      }

    }
  })

  return vue
}
```
