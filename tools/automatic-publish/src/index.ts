/*
 * @file: webpack插件-拷贝编译完成的静态资源，并自动将静态资源提交到远程仓库
 */
const colors = require('colors');
const exec = require('child_process').exec;
const fs = require('fs');
const Git = require("nodegit");
const path = require('path');
const cpx = require('cpx');
const fsExtra = require('fs-extra');
const makeDir = require('make-dir');
const rimraf = require('rimraf');
const openBrowser = require('open');


interface IAutomaticPublish {
  gitDir: string  // 执行git命令的根路径，默认是publish
  gitUrl: string // 需要提交更新的git地址
  version: number  // 自动提交时的版本号，默认是当前时间的毫秒数
  branch: string  // 执行git命令的分支名，默认是master
  source: string  // 静态资源需要拷贝的来源路径，必填项，无默认值
  destination: string // 静态资源需要拷贝到的目标路径，必填项，无默认值
  // remove: boolean // 是否删除旧文件，默认是删除
}
class AutomaticPublish {
    options: IAutomaticPublish
    constructor(options) {
        this.options = Object.assign({}, options);
    }

    apply(compiler) {
        let {
            gitDir = 'publish',
            gitUrl = '',
            branch = 'master',
            version = new Date().getTime(),
            source,
            destination,
            // remove = true
        } = this.options;

        /**
         * 执行拷贝操作
         *
         * @param {string} source - 被拷贝的路径
         * @param {string} destination - 目标路径
         * @return {Promise} - promise
         */
        function copyAction(source, destination) {
            return new Promise<void>((resolve, reject) => {
                if (!source || !destination) {
                    console.log(colors.red.underline('automatic-publish --- 请配置正确的拷贝参数'));
                    reject();
                    return;
                }
                let fileRegex = /(\*|\{+|\}+)/g;
                let matches = fileRegex.exec(source);
                if (matches === null) {
                    fs.lstat(source, (sErr, sStats) => {
                        if (sErr) return reject(sErr);

                        fs.lstat(destination, (dErr, dStats) => {
                            if (sStats.isFile()) {
                                let newDestination = dStats && dStats.isDirectory() ? destination + '/' + path.basename(source) : destination;

                                let pathInfo = path.parse(newDestination);

                                let execCopy = (src, dest) => {
                                    fsExtra.copy(src, dest, err => {
                                        if (err) reject(err);
                                        resolve();
                                    });
                                };

                                if (pathInfo.ext === '') {
                                    makeDir(newDestination).then(() => {
                                        execCopy(source, newDestination + '/' + path.basename(source));
                                    });
                                } else {
                                    execCopy(source, newDestination);
                                }
                            } else {
                                let sourceDir = source + (source.substr(-1) !== '/' ? '/' : '') + '**/*';
                                copyDirectory(sourceDir, destination, resolve, reject);
                            }
                        });
                    });
                } else {
                    copyDirectory(source, destination, resolve, reject);
                }
            });
        }

        /**
         * 执行拷贝文件夹
         *
         * @param {string} source - 被拷贝的路径
         * @param {string} destination - 目标路径
         * @param {Function} resolve - promise resolve
         * @param {Function} reject - promise reject
         * @return {void}
         */
        function copyDirectory(source, destination, resolve, reject) {
            let cpxOptions = {
                clean: false,
                includeEmptyDirs: true,
                update: false
            };

            cpx.copy(source, destination, cpxOptions, err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        }

        /**
         * 删除操作
         * @param {string} destination - 目标路径
         * @return {Promise} - promise
         */
        function deleteAction(destination) {
            return new Promise<void>((resolve, reject) => {
                if (typeof destination !== 'string') {
                    console.log(colors.red(`automatic-publish --- 请配置正确的目标路径`));
                    reject();
                }
                rimraf(destination, {}, err => {
                    if (err) {
                        reject();
                    }
                    resolve();
                });
            });
        }

        /**
         * 将命令行操作promisefy
         * @param {string} command - 命令行指令
         * @param {string} cwd - 命令行的路径
         * @return {Promise} - promise
         */
        function execPromise(command, cwd) {
            return new Promise<void>((resolve, reject) => {
                exec(command, { cwd }, async err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }

        /**
         * git切换分支,提交操作
         * @param {*} compilation - webpack编译类
         * @param {*} callback - 插件任务完成后的回调
         */
        const gitOperate = async (compilation, callback) => {
            const cwd = path.resolve(__dirname, '../../../', gitDir);
            const gitPath = path.resolve(__dirname, '../../../', gitDir, '.git');

            console.log();
            console.log('gitDir地址', cwd);
            console.log();
            console.log('gitDir中git项目地址', gitPath);

            let gitInfo: any = null // git 仓库信息
            let gitUrlPip: string = '' // git 构建流水线地址

            console.log();
            console.log(colors.yellow.underline(`automatic-publish --- 开始自动部署...`));

            // 确保gitDir存在(如果不存在就创建)
            try {
              await fsExtra.ensureDir(cwd)
              console.log(colors.yellow.underline(`automatic-publish --- 部署目录创建成功`));
            } catch (err) {
              console.log(colors.red.underline(`automatic-publish --- 部署目录创建失败`));
              callback();
              return
            }

            // 判断是否存在git仓库
            if(fsExtra.existsSync(gitPath)) {
                console.log(colors.yellow.underline(`automatic-publish --- 检查到文件目录下存在git项目`));
            }else {
              console.log(colors.red.underline(`automatic-publish --- 检查到文件目录不存在git项目，自动创建中...`));

              // 拉取git代码
              try {
                await execPromise(`git clone ${gitUrl} .`, cwd);
                console.log(colors.yellow.underline(`automatic-publish --- 拉取git代码成功`));
              } catch (error) {
                console.log(error);
                console.log(colors.yellow.underline(`automatic-publish --- 拉取git代码失败`));
                callback();
                return
              }

            }

            // 获取git仓库信息
            try {
               gitInfo = await Git.Repository.open(gitPath)
               console.log(colors.yellow.underline(`automatic-publish --- 获取git信息成功`));
            } catch (error) {
              console.log(error);

              console.log(colors.red.underline(`automatic-publish --- 获取git信息失败`));
              callback();
              return
            }

            // 判断git remote是否和传入的参数匹配
            const remotes = await gitInfo.getRemotes()
            const isEqGitUrl = remotes.find(remote => remote.url() === gitUrl)
            if(isEqGitUrl) {
              console.log(colors.yellow.underline(`automatic-publish --- gitUrl匹配成功`));
            } else {
              console.log(colors.red.underline(`automatic-publish --- gitUrl匹配失败，请检查gitUrl是否存在，如果存在请执行git remote对比git仓库地址信息`));
              callback();
              return
            }

            // 切换分支
            try {
                await execPromise(`git checkout ${branch}`, cwd);
                console.log(colors.yellow.underline(`automatic-publish --- 切换分支成功，当前分支:${branch}`));
            } catch (err) {
                console.log(colors.red.underline(`automatic-publish --- 切换${branch}分支失败`), err);
                callback();
                return;
            }

            // 拉取远程分支代码
            try {
                await execPromise(`git pull origin ${branch}`, cwd);
                console.log(colors.yellow.underline(`automatic-publish --- pull 远程仓库${branch}分支成功`));
            } catch (err) {
                console.log(colors.red.underline(`automatic-publish --- pull 远程仓库${branch}分支失败`, err));
                callback();
                return;
            }

            // 删除目标路径资源
            try {
                await deleteAction(destination);
                console.log(colors.yellow.underline(`automatic-publish --- 删除${destination}成功`));
            } catch (err) {
                console.log(colors.red.underline(`automatic-publish --- 删除${destination}失败`), err);
                callback();
                return;
            }

            // 拷贝资源到目标路径
            try {
                await copyAction(source, destination);
                console.log(colors.yellow.underline(`automatic-publish --- 拷贝${source}资源到${destination}成功`));
            } catch (err) {
                console.log(colors.red.underline(`automatic-publish --- 拷贝${source}资源到${destination}失败`), err);
                callback();
                return;
            }

            // add+commit
            try {
                await execPromise(`git add . && git commit -a -m 'auto-${branch}-git-${version}'`, cwd);
                console.log(colors.yellow.underline(`automatic-publish --- commit到${branch}分支成功`));
            } catch (err) {
                console.log(colors.red.underline(`automatic-publish --- commit到${branch}分支失败`), err);
                callback();
                return;
            }

            // push到远程分支
            try {
                await execPromise(`git push origin ${branch}`, cwd);
                console.log(colors.yellow.underline(`automatic-publish --- push到远程仓库${branch}分支成功`));
            } catch (err) {
                console.log(colors.red.underline(`automatic-publish --- push到远程仓库${branch}分支失败`), err);
                callback();
                return;
            }
            console.log(colors.green(`automatic-publish --- 自动化部署成功`))
            console.log(colors.green(`查看构建过程，请点击下方链接`))

            gitUrlPip = `${gitUrl.slice(0, gitUrl.length - 4)}/pipelines`

            console.log(colors.cyan(gitUrlPip));
            console.log();
            console.log();
            openBrowser(gitUrlPip);
            callback();
        }
        if (compiler.hooks) { // webpack >= 4
            compiler.hooks.afterEmit.tapAsync('gitOperate', gitOperate);
        } else { // webpack < 4
            compiler.plugin('after-emit', gitOperate);
        }
    }
}
module.exports = AutomaticPublish;
