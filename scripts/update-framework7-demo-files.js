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
  // Modify home page
  if (file === 'home.vue') {
    // Add App Framework info
    const infoText = `
      <f7-list class="searchbar-hide-on-search">
        <f7-list-item title="App Framework @ GitHub" external link="https://github.com/scriptPilot/app-framework#app-framework------">
          <f7-icon slot="media" f7="logo_github"></f7-icon>
        </f7-list-item>
      </f7-list>
      <f7-block inset>
        <p>This application is made with App Framework and powered by the beautiful Framework7, the powerful Vue, the native bridge Capacitor and bundled with Parcel. Use App Framework to realize your own amazing app - free and open source.</p>
      </f7-block>
    `;
    if (content.match(/<\/f7-navbar>/) === null) log.error('Did not find navbar text passage.');
    content = content.replace(/<\/f7-navbar>/, `</f7-navbar>${infoText}`);
    // Remove about link
    const aboutRegExp = /<f7-list class="searchbar-hide-on-search">[\n ]+<f7-list-item title="About Framework7" link="\/about\/">[\n ]+<f7-icon slot="media" icon="icon-f7"><\/f7-icon>[\n ]+<\/f7-list-item>[\n ]+<\/f7-list>/;
    if (content.match(aboutRegExp) === null) log.error('Did not find about text passage.');
    content = content.replace(aboutRegExp, '');
    // Rename components title block
    const componentsRegExp = /<f7-block-title class="searchbar-found">Components<\/f7-block-title>/;
    if (content.match(componentsRegExp) === null) log.error('Did not find about components passage.');
    content = content.replace(componentsRegExp, '<f7-block-title class="searchbar-found">Framework7 UI Components</f7-block-title>');
    // Rename themes title block
    const themesRegExp = /<f7-block-title class="searchbar-hide-on-search">Themes<\/f7-block-title>/;
    if (content.match(themesRegExp) === null) log.error('Did not find themes text passage.');
    content = content.replace(themesRegExp, '<f7-block-title class="searchbar-hide-on-search">Framework7 Themes</f7-block-title>');
    // Remove
    const titleRegExp = /<f7-nav-title>Framework7 Vue<\/f7-nav-title>/;
    if (content.match(titleRegExp) === null) log.error('Did not find title text passage.');
    content = content.replace(titleRegExp, '<f7-nav-title>App Framework</f7-nav-title>');
    // Remove router examples
    const routerRegExp = /<f7-block-title class="searchbar-hide-on-search">Page Loaders & Router<\/f7-block-title>[\n ]+<f7-list class="searchbar-hide-on-search">[\n ]+<f7-list-item title="Routable Modals" link="\/routable-modals\/"><\/f7-list-item>[\n ]+<f7-list-item title="Default Route \(404\)" link="\/load-something-that-doesnt-exist\/"><\/f7-list-item>[\n ]+<\/f7-list>/;
    if (content.match(routerRegExp) === null) log.error('Did not find router text passage.');
    content = content.replace(routerRegExp, '');
  }
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
let newAppComponent = currentAppComponent.replace(/<template>[\s\S]+<\/template>/, f7AppComponent.match(/<template>[\s\S]+<\/template>/));
// Make side panels theme dark
newAppComponent = newAppComponent.replace(/<f7-panel /g, '<f7-panel theme-dark ');
fs.writeFileSync(path.app('app.vue'), newAppComponent);

// Apply ESLint rules to harmonize files
run.script('test-eslint');

// Log success
log.success('Completed Framework7 demo files update.');
