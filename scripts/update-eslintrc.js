const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

const file = path.project('.eslintrc.json');
const config = {
  extends: [
    'airbnb-base',
    'plugin:vue/base',
  ],
};
fs.writeJsonSync(file, config, { spaces: 2 });
log.success('.eslintrc.json file updated.');
