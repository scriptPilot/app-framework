# App component

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

The structure of your application is defined in a Framework7-Vue component, so you should be familar with [Vue.js single file components](https://vuejs.org/v2/guide/single-file-components.html) as well as [Framework7-Vue](http://framework7.io/vue/).

The following content of the *app/app.vue* file is sufficient for a basic application:

```
<template>
  <div id="app">
    <f7-views>
      <f7-view main url="/home/" navbar-through :dynamic-navbar="$theme.ios" />
    </f7-views>
  </div>
</template>
```

If you want to assign CSS declarations to your complete application, you should do it in the app component:

```
  ...
</template>
<style>
  .navbar {
    background-color: #5dade2;
  }    
</style>
```

And to add functionality, you use the *script* block:

```
  ...
<script>
  export default {
    methods: {
      onF7Init: function () {
        this.$f7.alert('App is mounted!')        
      }
    }
  }
</script>
```

In [Framework7-Vue documentation](http://framework7.io/vue/app-layout.html), the app component is described as the *#app* div - you will find all details there.

[Babel / ES2015](https://babeljs.io/learn-es2015/) is supported in the app component.

You can pass custom Framework7 parameters to your application in the configuration file. Example:

```
"framework7parameters": {
  "swipePanel": "left"
}
```
