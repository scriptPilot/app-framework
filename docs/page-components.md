# Page components

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

The structure of each page component is defined in a Framework7-Vue component, so you should be familar with [Vue.js single file components](https://vuejs.org/v2/guide/single-file-components.html) as well as [Framework7-Vue](http://v1.framework7.io/vue/).

## File naming

For page component naming, please read the chapter [Routing](routing.md).

## Structure

A basic page component could look like this *app/pages/home.vue* file:

```
<template>
  <f7-page>
    <f7-navbar title="Home Page" />
    <f7-block>
      Welcome to your App!
    </f7-block>
  </f7-page>
</template>
```

Please read the [Framework7-Vue documentation](http://v1.framework7.io/vue/page.html) for page component structure details.

To add CSS, you use the *style* block:

```
  ...
</template>
<style>
  .content-block {
    color: red;
  }
</style>
```

To scope the style only for that page component, use `<style scoped>`.

And to add functionality, you use the *script* block:

```
  ...
<script>
  export default {
    methods: {
      onF7Init: function () {
        this.$f7.alert('Page is mounted!')        
      }
    }
  }
</script>
```

[Babel / ES2015](https://babeljs.io/learn-es2015/) is supported in page components.
