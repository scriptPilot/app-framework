// Import modules
const prompts = require('prompts');
const { resolve } = require('path');
const { execSync } = require('child_process');
const fs = require('fs-extra');

// Check if module is installed correctly
if (process.cwd() === resolve(__dirname, '../')) {
  process.stdout.write('You cannot create an application project in the App Framework folder.\n');
  process.exit(0);
}

// Async function wrapper
async function createNewProject() {
  // Get options from user
  const options = await prompts([
    {
      type: 'text',
      name: 'folderName',
      message: 'What should be the project folder name?',
      initial: 'my-app',
    },
    {
      type: 'select',
      name: 'template',
      message: 'Which template do you want to use?',
      choices: [
        { title: 'Vue', value: 'vue' },
        { title: 'Vue + Framework7', value: 'vue-framework7vue' },
        { title: 'Vue + Bootstrap', value: 'vue-bootstrapvue' },
        { title: 'Vue + Material', value: 'vue-materialvue' },
        { title: 'Vue + SAP UI5', value: 'vue-ui5' },
      ],
      initial: 1,
    },
    {
      type: 'select',
      name: 'eslint',
      message: 'How do you want to lint your code?',
      choices: [
        { title: 'ESLint recommend rules', value: 'recommend' },
        { title: 'ESLint + Airbnb JavaScript Style Guide', value: 'airbnb' },
        { title: 'ESLint + JavaScript Standard Style', value: 'standard' },
      ],
      initial: 1,
    },
    {
      type: 'multiselect',
      name: 'iconFonts',
      message: 'Which icon fonts do you want to use?',
      choices: [
        { title: 'Font Awesome', value: 'fontAwesome' },
        { title: 'Framework7 Icons', value: 'framework7' },
        { title: 'Ion Icons', value: 'ion' },
        { title: 'Material Design Icons', value: 'material' }
      ]
    }
  ]);

  // Check if project folder is available
  const projectFolder = resolve(process.cwd(), options.folderName);
  if (fs.pathExistsSync(projectFolder)) {
    process.stdout.write(`Folder "${projectFolder}" already exists.\n`);
    process.exit(1);
  }

  // Check if template exists
  const templateFolder = resolve(__dirname, '../templates/', options.template);
  if (!fs.pathExistsSync(templateFolder)) {
    process.stdout.write(`Template folder "${options.template}" not found.\n`);
    process.exit(1);
  }

  // Create project folder
  fs.ensureDirSync(projectFolder);
  process.chdir(projectFolder);

  // Create package.json file
  const packageJsonContent = {
    name: options.folderName,
    version: '1.0.0',
  };
  fs.writeJsonSync(resolve(projectFolder, 'package.json'), packageJsonContent, { spaces: 2 });

  // Copy index file
  fs.copySync(resolve(__dirname, '../templates/index.html'), resolve('app/index.html'));

  // Copy app files
  fs.copySync(templateFolder, resolve('app'));

  // Install app ressources
  const res = [];
  if (/^vue-/.test(options.template)) {
    res.push('vue');
  }
  if (options.template === 'vue-framework7vue') {
    res.push('framework7');
    res.push('framework7-vue');
  } else if (options.template === 'vue-bootstrapvue') {
    res.push('bootstrap-vue');
    res.push('bootstrap');
  } else if (options.template === 'vue-materialvue') {
    res.push('vue-material');
  } else if (options.template === 'vue-ui5') {
    res.push('@ui5/webcomponents');
  }
  execSync(`npm install --save ${res.join(' ')}`, { stdio: 'inherit' });

  // Install icon fonts
  const iconTags = []
  const iconPackages = []
  options.iconFonts.forEach(font => {
    if (font === 'fontAwesome') {
      iconTags.push('import \'@fortawesome/fontawesome-free/css/all.css\';')
      iconPackages.push('@fortawesome/fontawesome-free')
    } else if (font === 'framework7') {
      iconTags.push('import \'framework7-icons\';')
      iconPackages.push('framework7-icons')
    } else if (font === 'ion') {
      iconTags.push('import \'ionicons/dist/css/ionicons.min.css\';')
      iconPackages.push('ionicons')
    } else if (font === 'material') {
      iconTags.push('import \'material-icons/iconfont/material-icons.css\';')
      iconPackages.push('material-icons')
    }
  })
  if (iconTags.length > 0) {
    const appScriptFile = resolve(projectFolder, 'app/app.js')
    const appScriptFileContent = fs.readFileSync(appScriptFile, 'utf8') + '\n' + iconTags.join('\n') + '\n'
    fs.writeFileSync(appScriptFile, appScriptFileContent)
  }
  if (iconPackages.length > 0) {
    execSync(`npm install --save ${iconPackages.join(' ')}`, { stdio: 'inherit' });
  }

  // Copy .gitignore file
  fs.copySync(resolve(__dirname, '../templates/gitignore.txt'), resolve('.gitignore'));

  // Install App Framework
  execSync('npm install --save-dev ../app-framework', { stdio: 'inherit' });

  // Install ESLint and create config file
  if (options.eslint) {
    const config = {};
    // extend config
    const extend = [];
    if (options.eslint === 'recommend') {
      extend.push('eslint:recommended');
    } else if (options.eslint === 'airbnb') {
      extend.push('airbnb-base');
    } else if (options.eslint === 'standard') {
      extend.push('standard');
    }
    if (/^vue-/.test(options.template)) {
      extend.push('plugin:vue/recommended');
    }
    if (extend.length > 0) config.extends = extend;
    // Rules config
    if (/^vue-/.test(options.template)) {
      config.rules = {};
      config.rules['vue/html-self-closing'] = [
        'error',
        {
          html: {
            component: 'never',
          },
        },
      ];
    }
    // Save config file
    fs.writeJsonSync('.eslintrc.json', config, { spaces: 2 });
    // Installation
    const packages = ['eslint'];
    if (options.eslint === 'recommend') {
      packages.push('eslint-plugin-node');
      packages.push('eslint-plugin-import');
      packages.push('eslint-plugin-promise');
    } else if (options.eslint === 'airbnb') {
      packages.push('eslint-config-airbnb-base');
      packages.push('eslint-plugin-import');
    } else if (options.eslint === 'standard') {
      packages.push('eslint-config-standard');
      packages.push('eslint-plugin-standard');
      packages.push('eslint-plugin-node');
      packages.push('eslint-plugin-import');
      packages.push('eslint-plugin-promise');
    }
    if (/^vue-/.test(options.template)) {
      packages.push('eslint-plugin-import');
      packages.push('eslint-plugin-vue');
    }
    const uniquePackages = [...new Set(packages)];
    execSync(`npm install --save-dev ${uniquePackages.join(' ')}`, { stdio: 'inherit' });
  }

  // Run ESLint fix once to update code style (and reorder additional import tags)
  execSync('npx eslint --fix --ext .js,.vue app', { stdio: 'inherit' });

  // Success log
  process.stdout.write(`Open your application folder with "cd ${options.folderName}" and start the development server with "npx app dev".\n`);
}

createNewProject();
