# Languages Files

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

Languages files provide a simple way to make your app multi-lingual.

## Storage

Language files should be saved in folder *app/lang*. They should be JSON files with plain key:string pairs.

Example:

`lang/en.json`
```
{
  "emailSubject": "Greetings from Hamburg",
  "emailBody": "Hello {{username}}!"
}
```

`lang/de.json`
```
{
  "emailSubject": "Grüße aus Hamburg",
  "emailBody": "Hallo {{username}}!"
}
```

After you added a new language file, the development server should be restarted.

## Usage

In templates:
- `{{$lang('emailSubject')}}`
- `{{$lang('emailBody', {username: 'Bugs Bunny'})`

In scripts:
- `this.$lang('emailSubject')`
- `this.$lang('emailBody', {username: 'Bugs Bunny'})`

## Default language

To be configured, for example `"defaultLanguage": "en"`. This file is the master file to which all other language files are compared. If there are more keys than in the default language file, an error will be shown on any build command.

## Default language fallback

To be configured, by default `"defaultLanguageFallback": false`. If set to false, an error will be shown if any key is missing compared to the default language file on any build command. If set to true and a key is missing in a secondary language file, the default language is used.
