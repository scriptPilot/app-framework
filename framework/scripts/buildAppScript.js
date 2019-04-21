const { readFileSync, outputFileSync, readJsonSync } = require('fs-extra');
const mustache = require('mustache');

const config = readJsonSync('app/config.json');
const values = {
  frontendFramework7: config.frontend === 'framework7',
  frontendMaterial: config.frontend === 'material',
  frontendBootstrap: config.frontend === 'bootstrap',
  iconsFramework7: config.iconFonts.useFramework7Icons,
  iconsMaterial: config.iconFonts.useMaterialDesignIcons,
};
outputFileSync('cache/app.js', mustache.render(readFileSync('framework/appScriptTemplate.js', 'utf8'), values, null, ['/*', '*/']).replace(/from '\.\//g, 'from \'../framework/'));
console.log('Built app script.');
