// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Cancel if app folder already exists
if (fs.pathExistsSync(path.app())) {
  log.info('App folder already exists.');
  process.exit(0);
}

// Build app.vue file
const appComponentContent = `
<template>
  <f7-app :params="f7Params">
    <f7-statusbar></f7-statusbar>
    <f7-view url="/" :main="true" class="ios-edges"></f7-view>
  </f7-app>
</template>
<script>
import routes from './routes';

export default {
  data() {
    return {
      f7Params: {
        routes,
      },
    };
  },
};
</script>
`;
try {
  fs.outputFileSync(path.app('app.vue'), appComponentContent.trim());
  log.success('Created app.vue file.');
} catch (e) {
  log.error('Failed to create app.vue file.');
}

// Build pages/home.vue
const pageComponentContent = `
<template>
  <f7-page>
    <f7-navbar title="My App"></f7-navbar>
    <f7-block>
      <p>
        Welcome to your new App!
      </p>
    </f7-block>
  </f7-page>
</template>
`;
try {
  fs.outputFileSync(path.app('pages/home.vue'), pageComponentContent.trim());
  log.success('Created pages/home.vue file.');
} catch (e) {
  log.error('Failed to create pages/home.vue file.');
}

// Build routes.js
const routesFileContent = `
import homePage from './pages/home.vue';

export default [
  {
    path: '/',
    component: homePage,
  },
];

`;
try {
  fs.outputFileSync(path.app('routes.js'), routesFileContent.trim());
  log.success('Created routes.js file.');
} catch (e) {
  log.error('Failed to create routes.js file.');
}

// Copy icon file
try {
  fs.copySync(path.framework('media/icon.default.png'), path.app('icon.png'));
  log.success('Created icon.png file.');
} catch (e) {
  log.error('Failed to create icon.png file.');
}

// Create config.json file
if (run.script('fix-app-config').code !== 0) process.exit(1);

// Run ESLint to harmonize files
if (run.script('test-eslint').code !== 0) process.exit(1);

// Log success
log.success('Created app folder.');
