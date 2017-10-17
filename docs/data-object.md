# Global data object

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

App Framework provides a global persistent data object for common used data or settings.

The data object will be restored on each application reload and is accessible in any Vue hook `created` or later.

## With App Framework v1.13.2 or later

**Save data**
- Template: `<f7-button @click="$db('main.sub', 'value')">Save data</f7-button>`
- Script: `this.$db('main.sub', 'value')`

**Get data**
- Template: `{{$db('main.sub')}}`
- Script: `this.$db('main.sub')`

**Remove data**
- Template: `<f7-button @click="$db('main.sub', null)">Remove data</f7-button>`
- Script: `this.$db('main.sub', null)`

## With App Framework v1.12 or later

**Save data**

- Template: ```<f7-button @click="$save('main.sub', 'value')">Save data</f7-button>```
- Script: ```this.$save('main.sub', 'value')```

**Get data**

- Template: ```{{$get.main.sub}}```
- Script: ```this.$get.main.sub```

**Remove data**

- Template: ```<f7-button @click="$remove('main.sub')">Remove data</f7-button>```
- Script: ```this.$remove('main.sub')```

## With App Framework v1.11 or before

- To save data, use `this.$root.saveData(path, value)`
- To remove data, use `this.$root.removeData(path)`
- To retrieve data, use `this.$root.data.path`

The *path* must be a string, use a a point to nest data. Example:

```
created: function () {
  this.$root.saveData('greeting', 'Hello!')
  this.$root.saveData('names', {first: 'Jan', second: 'Tom', third: 'Sophie'})
  this.$root.removeData('names.second')
}
```

Now, the data object will look like following:

```
{
  greeting: 'Hello!',
  names: {
    first: 'Jan',
    third: 'Sophie'
  }
}
```

Example for the usage in templates:

```
<f7-block>
  <p>UTC date: {{$root.data.dateString}}</p>
  <f7-buttons>
    <f7-button @click="$root.saveData('dateString', (new Date()).toUTCString())">Update date</f7-button>
    <f7-button @click="$root.removeData('dateString')">Remove date</f7-button>
  </f7-buttons>
</f7-block>
```

Do not modify `$root.data` directly, because there wont be any update triggered.
