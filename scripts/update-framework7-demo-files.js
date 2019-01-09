// Import modules
const fs = require('fs-extra'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('./helper/path');
const log = require('./helper/logger');
const run = require('./helper/run');

// Define folders
const sourceFolder = path.resolve(__dirname, '../../framework7/kitchen-sink/vue/');

// Check folders
if (!fs.pathExistsSync(sourceFolder)) throw new Error(`Source folder ${sourceFolder} not found.`);
if (!fs.pathExistsSync(path.app())) throw new Error(`Destination folder ${path.app()} not found.`);

// Reset destination folder
fs.removeSync(path.app('pages'));
fs.removeSync(path.app('images'));

// Copy files
fs.copySync(path.resolve(sourceFolder, 'src/pages'), path.app('pages'));
fs.copySync(path.resolve(sourceFolder, 'img'), path.app('images'));
fs.copySync(path.resolve(sourceFolder, 'src/routes.js'), path.app('routes.js'));

// Apply ESLint rules to harmonize files
run.script('test-eslint');

// Modify imported vue files
let content;
fs.readdirSync(path.app('pages')).forEach((file) => {
  // Read file
  content = fs.readFileSync(path.app('pages', file), { encoding: 'utf-8' });
  // Remove code for import and export of components (bundle is used)
  content = content.replace(/import \{[\s\S.]+\} from 'framework7-vue';\n\n?/, '');
  content = content.replace(/components: \{[a-zA-Z0-9,\n ]+},\n/, '');
  content = content.replace(/export default \{[\n ]+\};\n/, '');
  content = content.replace(/<script>[\n ]+<\/script>\n/, '');
  // Disable ESLint for remaining scripts as they are not in line with Airbnb style guide
  content = content.replace(/<script>\n/, '<script>\n/* eslint-disable */\n');
  // Correct image path
  content = content.replace(/img\//g, '../images/');
  // Require images properly
  content = content.replace(/'\.\.\/images\/(.+)'/g, 'require(\'../images/$1\')');
  // Hide theme switch if it is the current one
  content = content.replace('link="./index.html?theme=ios">', 'link="./index.html?theme=ios" v-if="$f7.theme===\'md\'">');
  content = content.replace('link="./index.html?theme=md">', 'link="./index.html?theme=md" v-if="$f7.theme===\'ios\'">');
  // Update file
  fs.writeFileSync(path.app('pages', file), content);
});

// Modify CSS
let css = fs.readFileSync(path.resolve(sourceFolder, 'css/app.css'), { encoding: 'utf-8' });
// Remove icon font definitions
css = css.replace(/@font-face {[\s\S]+?}\n\n?/g, '');
css = css.replace(/\.material-icons {[\s\S]+?}\n\n?/g, '');
css = css.replace(/\.f7-icons {[\s\S]+?}\n\n?/g, '');
// Correct image paths
css = css.replace(/\.\.\/img/g, './images');

// Copy and modify app component / include css
let app = fs.readFileSync(path.resolve(sourceFolder, 'src/app.vue'), { encoding: 'utf-8' });
const appConfig = fs.readJsonSync(path.app('config.json'));
// Replace app ID
app = app.replace(/id: '(.+)'/, `id: '${appConfig.meta.appID}'`);
// Remove code for import and export of components (bundle is used)
app = app.replace(/import \{[\s\S.]+\} from 'framework7-vue';\n\n?/, '');
app = app.replace(/components: \{[a-zA-Z0-9,\n ]+},\n/, '');
app = app.replace(/export default \{[\n ]+\};\n/, '');
app = app.replace(/<script>[\n ]+<\/script>\n/, '');
// Add CSS
app = `${app}<style>\n${css}</style>\n`;
// Update file
fs.writeFileSync(path.app('app.vue'), app);

// Copy app.vue template
const currentAppComponent = fs.readFileSync(path.app('app.vue'), { encoding: 'utf-8' });
const f7AppComponent = fs.readFileSync(path.resolve(sourceFolder, 'src/app.vue'), { encoding: 'utf-8' });
const newAppComponent = currentAppComponent.replace(/<template>[\s\S]+<\/template>/, f7AppComponent.match(/<template>[\s\S]+<\/template>/));
fs.writeFileSync(path.app('app.vue'), newAppComponent);

// Apply ESLint rules to harmonize files
run.script('test-eslint');

// Log success
log.success('Completed Framework7 demo files update.');
