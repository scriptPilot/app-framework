/*

  Purpose: Create, validate and fix objects according scheme object

  Example scheme object:
  {
    "item": {
      "property": "value"
    }
  }

  Allowed properties:
  - type: text/array/object/boolean
  - allow: array
  - regexp: string
  - props: object
  - default: text/array/object/boolean

  Rules:
  1. Item must contain exact one property of type, allow, regexp or props
  2. Props must contain a scheme object itself
  3. Default is optional, must be valid itself and is allowed together with type, allow and regexp
  4. Default is required for allow and regexp
  5. Other props are not allowed

*/

'use strict'

// Import modules
let found = require('./found')
let type = require('./type')
let fs = require('fs-extra')

// Export object
module.exports = {
  getScheme: function (source) { // Return object or array with errors
    let schemeObject = this.getObject(source)
    if (type(schemeObject) === 'object') {
      let schemeValidationResult = this.validateSchemeObject(schemeObject)
      if (schemeValidationResult === true) {
        return schemeObject
      } else {
        return schemeValidationResult
      }
    } else {
      return ['Scheme source is no valid object or json file']
    }
  },
  getObject: function (source) { // Return object or false
    if (type(source) === 'object') {
      return source
    } else if (type(source) === 'string') {
      return this.loadJsonFile(source)
    } else {
      return false
    }
  },
  loadJsonFile: function (path) { // Return object or false
    try {
      return fs.readJsonSync(path)
    } catch (err) {
      return false
    }
  },
  validateValue (schemeItem, value) { // Return true or false
    if (schemeItem.type && schemeItem.type === type(value)) {
      return true
    } else if (schemeItem.allow && schemeItem.allow.indexOf(value) !== -1) {
      return true
    } else if (schemeItem.regexp !== undefined) {
      let regexpParts = schemeItem.regexp.match(/^\/(.+)\/([a-z]{0,3})$/)
      let regexp = RegExp(regexpParts[1], regexpParts[2])
      return regexp.test(value)
    } else {
      return false
    }
  },
  validateSchemeItem: function (item, properties, subItemStr) { // Return true or array with errors
    subItemStr = subItemStr ? subItemStr + '.' + item : item
    let errors = []
    // Validate property types (props and default tested later)
    if (properties.type && ['string', 'array', 'object', 'boolean'].indexOf(properties.type) === -1) {
      errors.push(subItemStr + ' type must be string, array, object or boolean')
    }
    if (properties.type && type(properties.type) !== 'string') {
      errors.push(subItemStr + ' type property must be a string')
    }
    if (properties.allow && type(properties.allow) !== 'array') {
      errors.push(subItemStr + ' allow property must be an array')
    }
    if (properties.regexp && (type(properties.regexp) !== 'string' || /^\/(.+)\/([a-z]{0,3})$/.test(properties.regexp) !== true)) {
      errors.push(subItemStr + ' regexp property must be a regular expression string')
    } else {

    }
    // 1. Item must contain exact one property of type, allow, regexp or props
    let propsFound = 0
    for (let p in properties) {
      if (['type', 'allow', 'regexp', 'props'].indexOf(p) !== -1) {
        propsFound++
      }
    }
    if (propsFound !== 1) {
      errors.push(subItemStr + ' must contain exact one property of type, allow, regexp or props')
    }
    // 2. Props must contain a scheme object itself
    let propsValidation = type(properties.props) === 'object' ? this.validateSchemeObject(properties.props, subItemStr) : true
    if (properties.props && propsValidation !== true) {
      errors = errors.concat(propsValidation)
    }
    // 3. Default is optional and allowed together with type, allow and regexp
    if (properties.default && !properties.type && !properties.allow && !properties.regexp) {
      errors.push(subItemStr + ' default property must be used together with type, allow or regexp')
    }
    if (properties.default && this.validateValue(properties, properties.default) !== true) {
      errors.push(subItemStr + ' default property is not valid')
    }
    // 4. Default is required for allow and regexp
    if ((properties.allow || properties.regexp) && !properties.default) {
      errors.push(subItemStr + ' must contain a default value')
    }
    // 5. Other props are not allowed
    propsFound = 0
    for (let p in properties) {
      if (['type', 'allow', 'regexp', 'props', 'default'].indexOf(p) === -1) {
        propsFound++
      }
    }
    if (propsFound > 0) {
      errors.push(subItemStr + ' contains other properties as type, allow, regexp, props or default')
    }
    // Return true or errors
    return errors.length === 0 ? true : errors
  },
  validateSchemeObject: function (object, subItemStr) { // Return true or array with errors
    let errors = []
    for (let item in object) {
      let schemeItemValidation = this.validateSchemeItem(item, object[item], subItemStr)
      if (schemeItemValidation !== true) {
        errors = errors.concat(schemeItemValidation)
      }
    }
    if (errors.length === 0) {
      return true
    } else {
      return errors
    }
  },
  validateObject: function (scheme, object, subItemStr) { // Return true or array with errors
    let errors = []
    // Loop items in scheme
    for (let item in scheme) {
      let thisSubItemStr = (subItemStr ? subItemStr + '.' : '') + item
      // Item missing in object
      if (object[item] === undefined) {
        errors.push('Item ' + thisSubItemStr + ' is missing')
      // Scheme item contains props
      } else if (scheme[item].props && type(object[item]) === 'object') {
        let propsValidation = this.validateObject(scheme[item].props, object[item], thisSubItemStr)
        if (propsValidation !== true) {
          errors = errors.concat(propsValidation)
        }
      // Check value
      } else {
        let valueValidation = this.validateValue(scheme[item], object[item])
        if (valueValidation !== true) {
          errors.push('Item ' + thisSubItemStr + ' value is not valid.')
        }
      }
    }
    // Return true or errors
    return errors.length === 0 ? true : errors
  },
  createItem: function (item, schemeItem) {
    if (schemeItem.default !== undefined) {
      return schemeItem.default
    } else if (schemeItem.type === 'array') {
      return []
    } else if (schemeItem.type === 'string') {
      return ''
    } else if (schemeItem.type === 'object') {
      return {}
    } else if (schemeItem.type === 'boolean') {
      return true
    } else if (schemeItem.props) {
      return this.createObject(schemeItem.props)
    } else {
      throw new Error('Failed to create item with unknown type.')
    }
  }, // Return
  createObject: function (schemeObject) {
    let object = {}
    for (let item in schemeObject) {
      object[item] = this.createItem(item, schemeObject[item])
    }
    return object
  },
  fixObject: function (schemeObject, objectToFix) {
    if (objectToFix === undefined) {
      return this.createObject(schemeObject)
    }
    let object = {}
    for (let item in schemeObject) {
      if (schemeObject[item].props !== undefined) {
        object[item] = this.fixObject(schemeObject[item].props, objectToFix[item])
      } else {
        let valueValidation = this.validateValue(schemeObject[item], objectToFix[item])
        object[item] = valueValidation === true && objectToFix[item] !== undefined ? objectToFix[item] : this.createItem(item, schemeObject[item])
      }
    }
    return object
  },
  markdownItem: function (item, schemeItem, shiftStr) {
    shiftStr = shiftStr !== undefined ? shiftStr + '&nbsp;&nbsp;&nbsp;' : ''
    // List props instead
    if (schemeItem.props !== undefined) {
      return shiftStr + item + ' | *object* |\n' +
             this.markdownObject(schemeItem.props, shiftStr)
    }
    // Define allowed values
    let allow = ''
    if (schemeItem.regexp !== undefined) {
      allow = schemeItem.regexp
    } else if (schemeItem.allow !== undefined) {
      allow = schemeItem.allow.join(', ')
    } else if (schemeItem.type !== undefined) {
      allow = '*' + schemeItem.type + '*'
    } else {
      throw new Error('Unknown markdown item. Please open an incident on GitHub.')
    }
    // Define default value
    let value = this.createItem(item, schemeItem)
    if (type(value) !== 'string') {
      value = JSON.stringify(value)
    }
    // Return table row
    return shiftStr + item + ' | ' + allow + ' |' + (value !== '' ? ' ' : '') + value + '\n'
  },
  markdownObject: function (schemeObject, shiftStr) {
    let table = ''
    for (let item in schemeObject) {
      table += this.markdownItem(item, schemeObject[item], shiftStr)
    }
    return table
  },
  create: function (scheme, saveToFile) { // Return object/update file or array with errors
    // Load and validate scheme
    scheme = this.getScheme(scheme)
    if (type(scheme) !== 'object') {
      return scheme
    }
    // Create object
    let object = this.createObject(scheme)
    // Save to file
    if (saveToFile !== undefined) {
      try {
        fs.writeJsonSync(saveToFile, object)
      } catch (err) {
        return ['Failed to write object to file.']
      }
    }
    // Return object
    return object
  },
  validate: function (scheme, objectSource) { // Return true or array with errors
    // Load and validate scheme
    scheme = this.getScheme(scheme)
    if (type(scheme) !== 'object') {
      return scheme
    }
    // Load object
    let object = this.getObject(objectSource)
    if (type(object) !== 'object') {
      return ['Object is no valid object or json file']
    }
    // Validate object
    return this.validateObject(scheme, object)
  },
  fix: function (scheme, objectSource) { // Return object/update file or array with errors
    // Load and validate scheme
    scheme = this.getScheme(scheme)
    if (type(scheme) !== 'object') {
      return scheme
    }
    // Load object
    let object = this.getObject(objectSource)
    if (type(object) !== 'object') {
      object = {}
    }
    // Validate object
    let fixedObject = this.fixObject(scheme, object)
    // Save to file
    if (type(objectSource) === 'string') {
      try {
        fs.writeJsonSync(objectSource, fixedObject)
      } catch (err) {
        return ['Failed to write object to file.']
      }
    }
    // Return object
    return fixedObject
  },
  markdown: function (scheme, toFile, betweenComments) {
    // Load and validate scheme
    scheme = this.getScheme(scheme)
    if (type(scheme) !== 'object') {
      return ['Invalid scheme.']
    }
    // Create markdown table
    let table = 'Option | Allowed | Default\n' +
                ':--- |:--- |:---\n' +
                this.markdownObject(scheme)
    // Save to file
    if (found(toFile) && type(betweenComments) === 'string') {
      try {
        let fileContent = fs.readFileSync(toFile, 'utf8')
        let regexp = RegExp('<!--( )?' + betweenComments + '( )?-->([\\s\\S.]*)<!--( )?\/' + betweenComments + '( )?-->') // eslint-disable-line
        fileContent = fileContent.replace(regexp, '<!-- ' + betweenComments + ' -->\n' + table + '<!-- /' + betweenComments + ' -->')
        fs.writeFileSync(toFile, fileContent)
      } catch (err) {
        return ['Failed to update documentation file.']
      }
    } else if (toFile && !found(toFile)) {
      return ['Documentation file not found.']
    }
    // Return markdown table
    return table
  }
}
