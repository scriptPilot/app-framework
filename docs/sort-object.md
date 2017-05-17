# sortObject function

> This page is part of the [App Framework Documentation](../DOCUMENTATION.md)

<br />

To sort an object, for example the result of a Firebase query, you can use the following function, which is attached to the window object.

`window.sortObject(obj, sortBy, sortDesc)`

- obj: Object to sort
- sortBy: Property to take for sorting
- sortDesc: undefined or 'desc'

```
let objUnsorted = {
  keyA: {
    name: 'Berta',
    age: 25
  },
  keyB: {
    name: 'Aaron',
    age: 40
  },
  keyC: {
    name: `Charlie`,
    age: 30
  }
}
```

Sort by name ascending:

```
let objSortedByName = window.sortObject(objUnsorted, 'name')
{
  keyB: { name: 'Aaron', age: 40 },
  keyA: { name: 'Berta', age: 25 },
  keyC: { name: `Charlie`, age: 30 }
}
```

Sort by age descending:

```
let objSortedByAgeDesc = window.sortObject(objectUnsorted, 'age', 'desc')
{  
  keyB: { name: 'Aaron', age: 40 },
  keyC: { name: `Charlie`, age: 30 },
  keyA: { name: 'Berta', age: 25 } 
}
```

For more complex data manipulation you can think about the integration of [Underscore.js](http://underscorejs.org/) or [Lodash](https://lodash.com/). Please see the chapter [Modules and Scripts](modules-and-scripts.md) for details
