/* Purpose: Exports function to sort an object by any property in ascending or descending order */

'use strict'

module.exports = function (obj, sortBy, sortDesc) {
  sortDesc = sortDesc === true || sortDesc === 'desc' || sortDesc === 'DESC'
  let arr = []
  for (let el in obj) {
    arr.push({
      '.key': el,
      '.sort': obj[el][sortBy] ? obj[el][sortBy] : ''
    })
  }
  arr.sort(function (a, b) {
    let result = null
    if (a['.sort'] === b['.sort'] === '') {
      result = 0
    } else if (a['.sort'] === '') {
      result = -1
    } else if (b['.sort'] === '') {
      result = 1
    } else {
      result = a['.sort'] - b['.sort']
    }
    result = sortDesc ? -1 * result : result
    return result
  })
  let sortedObj = {}
  for (let e = 0; e < arr.length; e++) {
    sortedObj[arr[e]['.key']] = obj[arr[e]['.key']]
  }
  return sortedObj
}
