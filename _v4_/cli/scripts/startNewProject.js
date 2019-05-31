const prompts = require('prompts');
const fs = require('fs-extra');
const { resolve } = require('path');
const { exec } = require('shelljs');
const cmd = require('node-cmd');
const logger = require('../helper/logger');

module.exports = async function startNewProject() {
  // Get options from user
  const options = await prompts([
    {
      type: 'select',
      name: 'template',
      message: 'Which template do you want to use?',
      choices: [
        { title: 'Vue', value: 'vue' },
        { title: 'Vue + Framework7', value: 'vue-framework7vue' },
        { title: 'Vue + Bootstrap', value: 'vue-bootstrapvue' },
        { title: 'Vue + Material', value: 'vue-materialvue' },
      ],
    },
    {
      type: 'text',
      name: 'folderName',
      message: 'What should be the name of the project folder?',
    },
  ]);

  // Check if project folder is available
  const projectFolder = resolve(process.cwd(), options.folderName);
  if (fs.pathExistsSync(projectFolder)) {
    logger.error(`Folder "${projectFolder}" already exists.`);
  }

  // Check if template exists
  const templateFolder = resolve(__dirname, '../../templates/', options.template);
  if (!fs.pathExistsSync(templateFolder)) {
    logger.error(`Template folder "${options.template}" not found.`);
  }

  // Create project folder
  fs.ensureDirSync(projectFolder);
  process.chdir(projectFolder);

  // Copy index file
  fs.copySync(resolve(__dirname, '../../templates/index.html'), resolve('app/index.html'));

  // Copy app files
  fs.copySync(templateFolder, resolve('app'));

  // Copy .gitignore file
  fs.copySync(resolve(__dirname, '../../templates/.gitignore'), resolve('.gitignore'));

  // Create package.json file
  const packageJsonContent = {
    name: options.folderName,
    version: '1.0.0',
  };
  fs.writeJsonSync(resolve(projectFolder, 'package.json'), packageJsonContent, { spaces: 2 });

  // Install App Framework
  exec('npm install --save-dev ../app-framework');

  // Success log
  logger.success(`Open your application folder with "cd ${options.folderName}" and start the development server with "npx app dev".`);
};
