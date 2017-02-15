let childProcess = require('child_process')
let showOnly = require('./show-only')

module.exports = {
  async: function (cwd, bin, params, callbackOnSuccess, callbackOnError) {
    let cmd = childProcess.spawn(bin, params, {cwd: cwd})
    let stdout = ''
    let errout = ''
    cmd.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    cmd.stderr.on('data', (data) => {
      errout += data.toString()
    })
    cmd.on('close', (code) => {
      if (code === 0) {
        if (typeof callbackOnSuccess === 'function') {
          callbackOnSuccess(errout)
        }
      } else if (typeof callbackOnError === 'function') {
        callbackOnError(errout)
      } else if (typeof callbackOnError === 'string') {
        showOnly('Error: ' + callbackOnError)
      } else {
        throw new Error(errout)
      }
    })
  },
  sync: function (cwd, bin, params, callbackOnSuccess, callbackOnError) {
    let spawn = childProcess.spawnSync(bin, params, {cwd: cwd, stdio: 'inherit'})
    if (spawn.status === 0) {
      if (typeof callbackOnSuccess === 'function') {
        callbackOnSuccess(spawn.stdout)
      }
    } else if (typeof callbackOnError === 'function') {
      callbackOnError(spawn.errout)
    } else if (typeof callbackOnError === 'string') {
      showOnly('Error: ' + callbackOnError)
    } else {
      throw new Error(spawn.stderr)
    }
  }
}
