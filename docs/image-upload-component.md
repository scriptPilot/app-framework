# Image upload component

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

In native iOS or Android applications, the `<input type="file" />` element does not work.

App Framework provides you a component, to upload an image to Firebase storage and save the image URI to the Firebase database.

## Configuration

In the configuration file, you have to add the following Cordova plugins:

```
"useCordovaPlugins": [
  "cordova-plugin-camera",
  "cordova-plugin-file"
]
```

## Usage

Just add the following component to any of your page components:

```
<f7-block>
  <image-uploader store="imageOnFirebaseHosting" db="urlInFirebaseDatabase" size="500" />
</f7-block>
```

- `store` is the Firebase storage path to your image (no extension)
- `db` is the Firebase database path to save the image URI (optional)
- `size` is the maximum image width or height (optional, ratio kept)

Please take care that the storage rules and database rules are correctly configured.
