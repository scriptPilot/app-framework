let jsdom = require('jsdom')
let jquery = require('jquery')
//let framework7 = require('./test-f7.js')

jsdom.env('<h1>Hello</h1>', function (err, window) {
  //let $ = jquery(window)
  let $ = require('./test-f7.js')(window)
  console.log($('h1').html())
})
