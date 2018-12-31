# Images

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

## Image usage

To use images in your application, you have to save them first in the `app/images` folder and point to them with a relative path in the *src* attribute.

```
<template>
  <f7-page>
    <f7-block>
      <img src="../images/yourImage.jpg" />
    </f7-block>
  </f7-page>
</template>
```

To remove images, you should remove the image tag first and delete the file afterwards.

## Dynamic image usage

During the build process, all *src* attributes are parsed by Webpack and mapped to the hashed image files. This does only work, if the *src* contains a string only - no variables.

So, for dynamic images, you should use single *img* elements and display them or not.

The following example shows *imageA.png* initially and after five seconds *imageB.png*.

```
<template>
  <f7-page>
    <f7-block>
      <img src="../images/imagesA.png" v-if="image==='imageA'" />
      <img src="../images/imagesB.png" v-else />
    </f7-block>
  </f7-page>
</template>
<script>
  export default {
    data: function () {
      return {
        image: 'imageA'
      }
    },
    mounted: function () {
      setTimeout(() => {
        this.image = 'imageB'
      }, 5000)
    }
  }
</script>
```

Another solution is, that you require all images in the script:

```
<template>
  <f7-page>
    <f7-block>
      <img :src="image" />
    </f7-block>
  </f7-page>
</template>
<script>
  export default {
    data: function () {
      return {
        image: require('../images/imageA.png')
      }
    },
    mounted: function () {
      setTimeout(() => {
        this.image = require('../images/imageB.png')
      }, 5000)
    }
  }
</script>
```

## Image preloading

App Framework provides image preloading by default. This means, all files in the folder `app/images` are loaded while the preloading page is shown and before the application is initialized.

This could increase the initial loading time, but will improve the behavior of your application because all images are immediately visible.

To disable image preloading, set `preloadImages: false` in the configuration file. To use the updated setting, you have to restart the development server.

To update the preloader after adding new images to your application, you have to restart the development server as well.
