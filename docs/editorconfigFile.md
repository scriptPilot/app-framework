# Configure .editorconfig file

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

The *.editorconfig* file will be updated automatically. You can configure it in the `editorConfig` item in the *app/config.json* file.

To write a line without value, for example `[*]`, assign value `null`, else assign the value as string or number.

Example:

```
"editorConfig": {
  "root": "true",
  "[*]": null,
  "indent_style": "space",
  "indent_size": 2,
  "charset": "utf-8",
  "trim_trailing_whitespace": "true",
  "insert_final_newline": "true",
  "end_of_line": "lf",
  "max_line_length": "null"
}
```
