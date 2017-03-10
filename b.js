'use strict'

console.log('B: Start')

let msg = require('./c')

msg('B: Request error exit via C', 'error')

console.log('B: End')


/*


  TO BE TESTED WITH FIREBASE LOGIN

  */
