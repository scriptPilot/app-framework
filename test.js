let fs = require('fs-extra')
let str = fs.readFileSync('../Framework7/kitchen-sink-ios/about.html', 'utf8')
let src = str.match(/(<div class="navbar[\s\S.]+)\n[ ]*<div class="pages.+\n[ ]*(<div data-page=.+)\n[ ]*(<[\s\S.]+)\n[ ]*<\/div>\n[ ]*<\/div>[\n ]*/)
let txt = '<template>\n' +
          '  ' + src[2] + '\n' +
          '    ' + src[1].replace(/\n/g, '\n    ') + '\n' +
          '    ' + src[3] + '\n' +
          '  </div>' + '\n' +
          '</template>'
fs.writeFileSync('test.vue', txt)
