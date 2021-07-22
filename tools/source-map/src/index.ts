const sm = require('source-map');
// const colors = require('colors')
const axios = require('axios')

// const { readFileSync } = fs;
const { SourceMapConsumer } = sm;
interface IinfoPos {
    /** 文件路径 */
    source: string
    /** 行 */
    line: number
    /** 列 */
    column: number
    /** 错误方法 */
    name: string
}

interface IPos {
    status: 'success' | 'error',
    values?: IinfoPos
    errorInfo?: any
}

/**
 *
 * @param {number} line // 行
 * @param {number} column // 列
 * @param {string} file // 文件路径
 */
export class SourceMap {
    line: number;
    column: number;
    file: string;
    sourceMapFile: string;
    rawSourceMap: any;
    constructor(line, column, file) {
        this.line = line
        this.column = column
        this.file = file
        this.sourceMapFile = `${this.file}.map`
    }

    // 获取 开发文件信息
    public getPos(): Promise<IPos> {
        return new Promise((resolve, reject) => {

            // 获取 map json
            return axios.get(this.sourceMapFile).then((rawSourceMap) => {
                this.rawSourceMap = rawSourceMap.data

                // 执行查找
                return SourceMapConsumer.with(this.rawSourceMap, null, consumer => {

                    try {
                        let pos = consumer.originalPositionFor({
                            line: this.line,   // 报错的行
                            column: this.column  // 报错的列
                        });

                        // 文件查找成功
                        resolve({
                            status: 'success',
                            values: pos
                        })
                    } catch (error) {

                        // 文件查找错误
                        reject({
                            status: 'error',
                            errorInfo: error
                        })
                    }
                })
            }).catch(error => {

                // 文件查找错误
                reject({
                  status: 'error',
                  errorInfo: error
              })
            })
        })
    }
}

