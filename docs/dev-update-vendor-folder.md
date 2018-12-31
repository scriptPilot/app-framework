# Update vendor folder

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

## Framework7

To be able to use the newest master branch of Framework7 and let developers use their modified Framework7 build, it is shipped directly with App Framework in the *vendor* folder.

To update Framework7 in the vendor folder:

1. Clone [Framework7 repo](https://github.com/nolimits4web/Framework7) in *Framework7* folder next to *app-framework* folder
2. Run `npm install` in *Framework7* folder
3. Run `npm run f7` in *app-framework* folder

The kitchen sink files in the *demo* folder and the *client/theme-colors.json* file are updated as well.

## Framework7-Vue

To be able to use the newest master branch of Framework7-Vue and let developers use their modified Framework7-Vue build, it is shipped directly with App Framework in the *vendor* folder.

To update Framework7-Vue in the vendor folder:

1. Clone [Framework7-Vue repo](https://github.com/nolimits4web/Framework7-Vue) in *Framework7-Vue* folder next to *app-framework* folder
2. Run `npm install` in *Framework7-Vue* folder
3. Run `npm run f7vue` in *app-framework* folder

## Material Design Icons

To avoid the need to install the huge Material Design Icons archive and to get the mapping between ligatures and codepoints, it is shipped directly with App Framework in the *vendor* folder.

To update Material Design Icons in the vendor folder:

1. Clone [Material Design Icons repo](https://github.com/google/material-design-icons) in *material-design-icons* folder next to *app-framework* folder
2. Run `npm run iconfonts` in *app-framework* folder

The *client/material-codepoints.json* file is updated as well.
