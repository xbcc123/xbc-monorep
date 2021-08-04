import chalk from 'chalk';

import fs from 'fs';

import ncp from 'ncp';

import path from 'path';

import { promisify } from 'util';

const access = promisify(fs.access);

const copy = promisify(ncp);

// 递归拷贝文件

async function copyTemplateFiles(options) {
 return copy(options.templateDirectory, options.targetDirectory, {
   clobber: false,
 });
}

// 创建项目

export async function createProject(options) {

 options = {

   ...options,

   targetDirectory: options.targetDirectory || process.cwd(),

 };

 const currentFileUrl = import.meta.url;

 const templateDir = path.resolve(
   new URL(currentFileUrl).pathname,
   '../../templates',
   options.template.toLowerCase()
 );

 options.templateDirectory = templateDir;

 try {

 	 // 判断模板是否存在

   await access(templateDir, fs.constants.R_OK);

 } catch (err) {

 	 // 模板不存在

   console.error('%s Invalid template name', chalk.red.bold('ERROR'));

   process.exit(1);

 }

 // 拷贝模板

 await copyTemplateFiles(options);

 console.log('%s Project ready', chalk.green.bold('DONE'));

 return true;

}
