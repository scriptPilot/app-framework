const { exec } = require('shelljs')

console.log('Starting production build ...')
exec('npx parcel build cache/index.html --cache-dir cache/parcel --out-dir build/web --public-url . --no-source-maps')
