# Trouble shooting

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

The following points should be checked for trouble shooting:

- Cache is reset (could be done with `npm run reset`)
- No interferences with other files
- Only absolute paths used
- process.env allways considered as object with strings (`process.env.ANY === 'true'`)
- All `require()` commands contain only strings and/or `process.env[...]` as variable
- Values from `window.localStorage` are parsed with `JSON.parse()` before usage

Let us know if you have points to add.
