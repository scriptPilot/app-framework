const { execSync } = require('child_process')

execSync('node scripts/a', { stdio: 'inherit' })
execSync('node scripts/b', { stdio: 'inherit' })
execSync('node scripts/c', { stdio: 'inherit' })
execSync('node scripts/d', { stdio: 'inherit' })
execSync('node scripts/e', { stdio: 'inherit' })


/*
function run(scriptName) {

}




function run(scriptName) {
  const cp = spawn('node', `scripts/${scriptName}`)
  cp.on('close', code => {
    if (code !== 0) reject()
    resolve()
    })
  })
}

async function runAll() {
  await run('a')
  await run('b')
  await run('c')
}

runAll()


function addAll(){
  addString('', 'A')
  .then(result => addString(result, 'B'))
  .then(result => addString(result, 'C'))
  .then(result => {
    console.log(result) // Prints out " A B C"
  })
}

async function addAll(){
  let toPrint = ''
  toPrint = await addString(toPrint, 'A')
  toPrint = await addString(toPrint, 'B')
  toPrint = await addString(toPrint, 'C')
  console.log(toPrint) // Prints out " A B C"
}
*/
