const { copySync } = require('fs-extra');
const { resolve } = require('path');

console.log('INIT CWD', process.env.INIT_CWD);
console.log('RESOLVE', resolve());
copySync(resolve(__dirname, '../../app'), resolve('app'));
