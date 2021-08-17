const { projectInstall } = require('pkg-install');
const { access } = require('fs/promises');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const execa = require('execa');
const Listr = require('listr');
const util = require('util');
const ncp = require('ncp');
const copy = util.promisify(ncp);

// 拷贝模板
async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

// 初始化 git
async function initGit(options) {
  // 执行 git init
  const result = await execa('git', ['init'], {
    cwd: options.targetDirectory,
  });

  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return;
}

// 创建项目
export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()

  };

  const templateDir = path.resolve(
    __dirname,
    '../templates',
    options.template
  );

  options.templateDirectory = templateDir;

  try {
    console.log(templateDir);

    // 判断模板是否存在
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  // 声明 tasks

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Initialize git',
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: 'Install dependencies',
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.runInstall
          ? 'Pass --install to automatically install dependencies'
          : undefined,
    },
  ]);

  // 并行执行 tasks
  await tasks.run();
  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}
