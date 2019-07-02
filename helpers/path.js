/* Purpose: Extend native Node paths functions with shortcuts to often used folders */

// Import modules
const path = require('path');

// Framework related shortcuts
path.framework = (...nav) => path.resolve(__dirname, '../', ...nav);
path.cache = (...nav) => path.resolve(__dirname, '../cache', ...nav);
path.scripts = (...nav) => path.resolve(__dirname, '../scripts', ...nav);

// Project related shortcuts
path.project = (...nav) => path.resolve(process.cwd(), ...nav);
path.app = (...nav) => path.resolve(process.cwd(), 'app', ...nav);

// Export extended path functions
module.exports = path;
