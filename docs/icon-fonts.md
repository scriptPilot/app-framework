# Icon fonts

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

This section will be described in detail in the future.

## Legacy support

To display icon fonts in older browsers and Android versions, App Framework will automatically replace ligatures to code:

Examples:

- `<i class="material-icons">done</i>` is replaced with `<i class="material-icons">&#xE876;</i>`
- `<f7-icon material "done" />` will generate `<i class="material-icons">&#xE876;</i>`
