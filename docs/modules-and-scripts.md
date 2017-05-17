# Modules and Scripts

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

This section will be described in detail in the future.

## NPM modules

Follow these steps to install and use a package from the [npm repository](https://www.npmjs.com/):

1. Install module with `npm install --save-dev <package_name>`
2. Import module at the beginning of the script block with `import <var_name> from '<package_name>'`

Example: `npm install --save-dev underscore`

```
<script>

  import _ from 'underscore'

  export default {
    mounted: function () {
      let numbers = [1, 4, 34, 145]
      window.f7.alert('In my list are ' + _.size(numbers) + ' numbers!')
    }
  }
  
</script>
```

## Local module

Follow these steps to use a local module (.js / .vue / .json):

1. If not exists, create a folder *vendor*
2. Save the module to *vendor/<module_name>.<module_extension>*
3. Import the module at the beginning of the script block with `import <var_name> from '../../vendor/<module_name>'`

Example: *vendor/underscore.js*

```
<script>

  import _ from '../../vendor/underscore'

  export default {
    mounted: function () {
      let numbers = [1, 4, 34, 145]
      window.f7.alert('In my list are ' + _.size(numbers) + ' numbers!')
    }
  }
  
</script>
```
