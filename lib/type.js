/*

  Purpose: Return type of input as string

*/

module.exports = function (inp) {
  if (inp === undefined) return undefined
  else if (inp === null) return null
  else if (Array.isArray(inp) === true) return 'array'
  else if (typeof inp === 'object') return 'object'
  else if (typeof inp === 'string') return 'string'
  else if (typeof inp === 'boolean') return 'boolean'
  else if (typeof inp === 'function') return 'function'
  else throw new Error('Unknown type of input: ' + inp)
}
