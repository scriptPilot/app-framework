#!/usr/bin/env node

const program = require('commander');
const { exec } = require('shelljs');
const { resolve } = require('path');
const List = require('prompt-list');

function getJSFramework(cb) {
  const list = new List({
    message: 'Which JavaScript Framework do you want to use?',
    choices: [
      'Vue',
      { name: 'React', disabled: 'Planned for the future' },
      'No Framework',
    ],
  });
  list.ask(JSFramework => cb);
}

program
  .command('init')
  .action(() => {
    const list = new List({
      message: 'Which JavaScript Framework do you want to use?',
      choices: [
        'Vue',
        { name: 'React', disabled: 'Planned for the future' },
        'No Framework',
      ],
    });
    list.ask((JSFramework) => {
      const list = new List({
        message: 'Which UX Framework do you want to use?',
        choices: [
          'Framework7',
          'Material',
          'Bootstrap',
          'No Framework',
        ],
      });
      list.ask((UXFramework) => {
        console.log(JSFramework, UXFramework);
      });
    });
  });

/*

console.log('CWD', resolve())
console.log('CWD FW', resolve('framework'))
console.log('DIRNAME', __dirname)
console.log('DEVELOPMENT', resolve('framework') === __dirname)

function run(scriptName) {
  const scriptFile = resolve(__dirname, 'scripts', scriptName)
  exec(`node ${scriptFile}`)
}

*/

program
  .command('dev')
  .action(() => {
    run('fixCode');
    run('fixConfig');
    run('buildAppScript');
    run('buildIndexFile');
    exec(`npx concurrently --kill-others "node ${__dirname}/watchAppConfig" "node ${__dirname}/buildDev"`);
  });

program
  .command('dev-electron')
  .action(() => {
    run('fixCode');
    run('fixConfig');
    run('buildAppScript');
    run('buildIndexFile');
    exec(`npx concurrently --kill-others "node ${__dirname}/watchAppConfig" "node ${__dirname}/buildDevElectron"`);
  });

program
  .command('build')
  .action(() => {
    run('fixCode');
    run('fixConfig');
    run('buildAppScript');
    run('buildIndexFile');
    run('buildWeb');
  });

program.parse(process.argv);
