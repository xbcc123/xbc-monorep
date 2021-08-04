// import arg from 'arg';
// import inquirer from 'inquirer';
const arg = require('arg')
const inquirer = require('inquirer')

// 解析命令行参数为 options
function parseArgumentsIntoOptions(rawArgs) {
    // 使用 arg 进行解析
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install',
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    console.log(args);
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false,
    }
}

// 接受参数之后的操作
async function promptForMissingOptions(options) {
  // 默认使用名为 JavaScript 的模板
  const defaultTemplate = 'JavaScript';
  // 使用默认模板则直接返回
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }
  // 准备交互式问题
  const questions = [];
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['JavaScript', 'TypeScript'],
      default: defaultTemplate,
    });
  }
  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false,
    });
  }
  // 使用 inquirer 进行交互式查询，并获取用户答案选项
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
  };
 }

export async function cli(args) {
    console.log(args);
    // 获取命令行配置
    let options = parseArgumentsIntoOptions(args);
    console.log(options);
    options = await promptForMissingOptions(options);
    console.log(options);
}
