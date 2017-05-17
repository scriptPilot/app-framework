# Trouble shooting

> This page is part of the [App Framework Development Documentation](../DEVELOPMENT.md)

<br />

The following points should be checked for trouble shooting:

- Cache is reset (could be done with `npm run reset`)
- No interferences with other files?
- All `require()` commands contain only strings and/or `process.env[...]` as variable
- Values from `window.localStorage` are parsed with `JSON.parse()` before usage

Let us know if you have points to add.
