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
    values: IinfoPos
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

    public getPos(): Promise<IPos> {
        return axios.get(this.sourceMapFile).then((rawSourceMap) => {
            this.rawSourceMap = rawSourceMap.data
            return SourceMapConsumer.with(this.rawSourceMap, null, consumer => {
                let pos = null
                let resultPos = {}
                try {
                    pos = consumer.originalPositionFor({
                        line: this.line,   // 报错的行
                        column: this.column  // 报错的列
                    });

                    // 文件查找成功
                    resultPos = {
                        status: 'success',
                        values: pos
                    }
                } catch (error) {

                    // 文件查找错误
                    resultPos = {
                        status: 'error',
                        values: error
                    }
                }
                return resultPos
            })
        })
    }
}

