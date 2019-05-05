#!/usr/bin/env node

const program = require('commander');
const { exec } = require('shelljs');
const { resolve } = require('path')
const List = require('prompt-list')
const prompts = require('prompts')

async function testPrompts() {
  const response = await prompts([{
    type: 'select',
    name: 'color',
    message: 'Pick colors',
    choices: [
      { title: 'Red', value: '#ff0000' },
      { title: 'Green', value: '#00ff00' },
      { title: 'Blue', value: '#0000ff' }
    ],
  },{
  type: null,
  name: 'forgetme',
  message: `I'll never be shown anyway`,
},{
        type: 'text',
        name: 'username',
        message: 'What is your GitHub username?'
    },
    {
        type: 'number',
        name: 'age',
        message: 'How old are you?'
    },
    {
        type: 'text',
        name: 'about',
        message: 'Tell something about yourself',
        initial: 'Why should I?'
    }]);

  console.log(response); // => { value: 24 }
}

program
  .action(() => {
    testPrompts()
  })

program.parse(process.argv);
