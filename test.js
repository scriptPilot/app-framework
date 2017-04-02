let fs = require('fs-extra')
let str = fs.readFileSync('../Framework7/kitchen-sink-ios/about.html', 'utf8')
let src = str.match(/<div class="navbar[\s\S.]+<\/div>[\n ]*/)
console.log(src)
