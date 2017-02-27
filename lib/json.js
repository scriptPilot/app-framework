// Load modules
let fs = require('fs-extra')

// Function to validate item
let validateObject = function (scheme, object, parentStr) {
  // Empty parent string
  parentStr = parentStr !== undefined ? parentStr + '.' : ''
  // No errors at the beginning
  let errors = []
  // Loop scheme items
  for (let item in scheme) {
    // Scheme item is no object
    if (typeof scheme[item] !== 'object' || scheme[item] === null) {
      errors.push('Scheme item "' + parentStr + item + '" is not valid.')
    // Object item is defined
    } else if (object !== undefined && object[item] === undefined) {
      errors.push('Item "' + parentStr + item + '" is missing.')
    // Scheme item is object and object item is defined
    } else {
      // Copy scheme item props
      let type = scheme[item].type
      let allow = scheme[item].allow
      let regex = scheme[item].regex
      let value = scheme[item].default
      let props = scheme[item].props
      // Scheme item props are missing
      if (type === undefined && allow === undefined && regex === undefined) {
        errors.push('Scheme item "' + parentStr + item + '" needs type, allow or regex property.')
      // Scheme item uses props and other values together
      } else if (props !== undefined && (type !== undefined && allow !== undefined && regex !== undefined && value !== undefined)) {
        errors.push('Scheme item "' + parentStr + item + '" uses props together with type, allow, regex or value.')
      // Type string is used together with allow or regex
      } else if (type !== undefined && (allow !== undefined || regex !== undefined)) {
        errors.push('Scheme item "' + parentStr + item + '" uses type together with allow or regex.')
      // Type boolean without default value
      } else if (type === 'boolean' && value === undefined) {
        errors.push('Scheme item "' + parentStr + item + '" is boolean but has no default value.')
      // Regex without default value
      } else if (regex !== undefined && value === undefined) {
        errors.push('Scheme item "' + parentStr + item + '" has regex but no default value.')
      // Allow and regex are used together
      } else if (allow !== undefined && regex !== undefined) {
        errors.push('Scheme item "' + parentStr + item + '" has both allow and regex properties.')
      // Allow is not array
      } else if (allow !== undefined && Array.isArray(allow) !== true) {
        errors.push('Scheme item allow property "' + parentStr + item + '" should be an array.')
      // Scheme item props are valid
      } else {
        // Scheme type given
        if (type !== undefined) {
          if (type === 'string') {
          if (value !== undefined && typeof value !== 'string') {
              errors.push('Scheme default value for item "' + parentStr + item + '" should be a string.')
            }
          if (object !== undefined && typeof object[item] !== 'string') {
              errors.push('Item "' + parentStr + item + '" should be a string.')
            }
        } else if (type === 'boolean') {
            if (value !== undefined && typeof value !== 'boolean') {
              errors.push('Scheme default value for item "' + parentStr + item + '" should be true or false.')
            }
            if (object !== undefined && typeof object[item] !== 'boolean') {
              errors.push('Item "' + parentStr + item + '" should be true or false.')
            }
          } else if (type === 'object') {
            if (value !== undefined && typeof value !== 'object' || value === null) {
              errors.push('Scheme default value for item "' + parentStr + item + '" should be an object.')
            }
            if (object !== undefined && (typeof object[item] !== 'object' || object[item] === null)) {
              errors.push('Item "' + parentStr + item + '" should be an object.')
            }
          } else if (type === 'array') {
            if (value !== undefined && Array.isArray(value) !== true) {
              errors.push('Scheme default value for item "' + parentStr + item + '" should be an array.')
            }
            if (object !== undefined && Array.isArray(object[item]) !== true) {
              errors.push('Item "' + parentStr + item + '" should be an array.')
            }
          } else {
            errors.push('Scheme type for item "' + parentStr + item + '" is unknown (' + type + ').')
          }
        }
        // Scheme allow given
        if (allow !== undefined) {
          if (allow.indexOf(value) === -1) {
          errors.push('Scheme default value for item "' + parentStr + item + '" should be element of [' + allow.join(', ') + '].')
        }
          if (object !== undefined && allow.indexOf(object[item]) === -1) {
          errors.push('Item "' + parentStr + item + '" should be element of [' + allow.join(', ') + '].')
        }
        }
        // Scheme regex given
        if (regex !== undefined) {
          try {
          let exp = new RegExp(regex.match(/\/(.+)\/(.*)/)[1], regex.match(/\/(.+)\/(.*)/)[2])
          if (exp.test(value) !== true) {
              errors.push('Scheme default value "' + parentStr + item + '" should meet regex "' + regex + '".')
            }
          if (object !== undefined && exp.test(object[item]) !== true) {
              errors.push('Item "' + parentStr + item + '" should meet regex "' + regex + '".')
            }
        } catch (err) {
          errors.push('Scheme regex for item "' + parentStr + item + '" not valid.')
        }
        }
        // Scheme item has props
        if (props !== undefined) {
          errors = errors.concat(validateObject(scheme[item].props, object ? object[item] : undefined, parentStr + item))
        }
      }
    }
  }
  // Loop object items
  for (let item in object) {
    if (scheme[item] === undefined) {
      errors.push('Item "' + parentStr + item + '" not found in scheme.')
    }
  }
  // Return errors
  return errors
}

// Function to create item
let createObject = function (scheme, parentStr) {
  parentStr = parentStr !== undefined ? parentStr + '.' : ''
  let object = {}
  for (let item in scheme) {
    let value
    if (scheme[item].props !== undefined) {
      value = createObject(scheme[item].props, parentStr + item)
    } else if (scheme[item].default !== undefined) {
      value = scheme[item].default
    } else if (scheme[item].type === 'boolean') {
      value = true
    } else if (scheme[item].type === 'object') {
      value = {}
    } else if (scheme[item].type === 'array') {
      value = []
    } else {
      throw new Error('Scheme for item "' + parentStr + item + '" is not properly defined.')
    }
    object[item] = value
  }
  return object
}

// Functions to create documentation
let createDocumentation = function (scheme, docType, parentStr, listIndent) {
  parentStr = parentStr !== undefined ? parentStr + '.' : ''
  listIndent = listIndent !== undefined ? listIndent + '  ' : ''
  let table = parentStr === '' ? 'Option | Allowed | Default' + '\n' + ':--- |:--- |:---' + '\n' : ''
  let list = ''
  for (let item in scheme) {
    let option = parentStr + item
    let type = scheme[item].type !== undefined ? scheme[item].type : (scheme[item].props !== undefined ? 'object' : 'string')
    let allowed = scheme[item].type !== undefined ? '*' + scheme[item].type + '*' : '*string*'
    if (scheme[item].regex) allowed = scheme[item].regex
    if (scheme[item].allow) allowed = scheme[item].allow.join(', ')
    if (scheme[item].props) allowed = ''
    let value = scheme[item].default ? JSON.stringify(scheme[item].default) : ''
    if (scheme[item].default === false) value = 'false'
    table += option + ' | ' + allowed + ' | ' + value + '\n'
    list += listIndent + '- `' + item + '`' + '\n'
    if (scheme[item].note !== undefined) list += listIndent + '  - Note: ' + scheme[item].note + '\n'
    if (type) list += listIndent + '  - Type: ' + type + '\n'
    if (scheme[item].allow) list += listIndent + '  - Allowed: ' + scheme[item].allow.join(', ') + '\n'
    if (scheme[item].regex) list += listIndent + '  - Pattern: ' + scheme[item].regex + '\n'
    if (value) list += listIndent + '  - Default: ' + value.replace(/^"(.+)"$/, '$1') + '\n'
    if (scheme[item].props !== undefined) {
      table += createDocumentation(scheme[item].props, docType, parentStr + item, listIndent)
      list += createDocumentation(scheme[item].props, docType, parentStr + item, listIndent)
    }
  }
  return docType === 'list' ? list : table
}

module.exports = {
  // Function to validate json object according scheme
  validate: function (scheme, object) {
    // Read scheme from file
    if (typeof scheme === 'string') {
      scheme = fs.readJsonSync(scheme)
    }
    // Check scheme
    if (typeof scheme !== 'object' || scheme === null) {
      throw new Error('Scheme not valid')
    }
    // Read object from file
    if (typeof object === 'string') {
      object = fs.readJsonSync(object)
    }
    // Check object
    if (typeof object !== 'object' || object === null) {
      throw new Error('Object not valid')
    }
    // Validate object
    let errors = validateObject(scheme, object)
    // Return errors
    return errors.length === 0 ? true : 'Errors on JSON scheme validation:' + '\n- ' + errors.join('\n- ')
  },
  // Function to create json object from scheme
  create: function (scheme, destination) {
    // Read scheme from file
    if (typeof scheme === 'string') {
      scheme = fs.readJsonSync(scheme)
    }
    // Check scheme
    if (typeof scheme !== 'object' || scheme === null) {
      throw new Error('Scheme not valid')
    }
    // Validate scheme
    let errors = validateObject(scheme)
    // Validation failed
    if (errors.length > 0) {
      return 'Errors on JSON scheme validation:' + '\n- ' + errors.join('\n- ')
    // Validaton ok
    } else {
      let object = createObject(scheme)
      if (destination !== undefined) {
        fs.writeJsonSync(destination, object, {space: 2})
        return true
      } else {
        return object
      }
    }
  },
  // Function to create documentation from scheme
  docu: function (scheme) {
    // Read scheme from file
    if (typeof scheme === 'string') {
      scheme = fs.readJsonSync(scheme)
    }
    // Check scheme
    if (typeof scheme !== 'object' || scheme === null) {
      throw new Error('Scheme not valid')
    }
    // Validate scheme
    let errors = validateObject(scheme)
    // Validation failed
    if (errors.length > 0) {
      return false
    // Validaton ok
    } else {
      return createDocumentation(scheme, 'list')
    }
  }
}
