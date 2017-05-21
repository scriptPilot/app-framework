# Icon fonts

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

## Usage

App Framework is well prepared to use comprehensive icon fonts for your application.

To use an icon font, you have to set `true` in the configuration:

```
"useIconFonts": {
  "framework7": true,
  "material": true,
  "ion": false,
  "fontawesome": false
}
```

After you changed the configuration, you have to restart the development server.

## Icon overview

- [Framework7 Icons](https://framework7.io/icons/)
- [Material Design Icons](https://material.io/icons/)
- [Ion Icons](http://ionicons.com/)
- [FontAwesome Icons](http://fontawesome.io/icons/)

## Legacy support

To display icon fonts in older browsers and Android versions, App Framework will automatically replace ligatures to code. Currently, this works only for the Material icon font.

Example: `<f7-icon material "done" />` will generate `<i class="material-icons">&#xE876;</i>`
