// Import modules
const path = require('path');

// Determine App Framework development mode
const devMode = process.cwd() === path.resolve(__dirname, '../../')

// App Framework related shortcuts
path.framework = (...nav) => path.resolve(__dirname, '../../', ...nav);
path.cache = (...nav) => path.resolve(__dirname, '../../cache', ...nav);
path.scripts = (...nav) => path.resolve(__dirname, '../', ...nav);

// Project related shortcuts
path.project = (...nav) => path.resolve(process.cwd(), ...nav);
path.app = (...nav) => path.resolve(process.cwd(), devMode ? 'demo-app' : 'app', ...nav);
path.build = (...nav) => path.resolve(process.cwd(), 'build', ...nav);

// Export extended path module
module.exports = path;
