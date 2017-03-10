'user strict'

console.log('A: Start')

require('child_process').spawn('node', ['b.js'], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
}).on('message', function(data) {
  console.log('A: Message from B')
  if (data === 'exit with error') {
    console.log('A: B ask to exit with error')
    //process.exit(1)
  } else {
    console.log('A: B ask to exit without error')
    //process.exit(0)
  }
}).on('close', function(code) {
  console.log('A: B closed with ' + code)
});

console.log('A: End')
