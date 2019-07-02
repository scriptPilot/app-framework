const log = require('../helpers/logger')

log.info('test')

try {
  throw new Error('unhandled')
} catch (e) {
  log.info('Error with message: ' + e.message)
  log.error('Script failed.')
}

log.success('success')
