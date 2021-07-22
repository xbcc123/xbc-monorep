const fs = require('fs-extra');
const path = require('path');
const sm = require('source-map');

const { readFileSync } = fs;
const { SourceMapConsumer } = sm;

const pwd = path.resolve(__dirname)

// 这里是我们的.map文件地址
// const rawSourceMap = JSON.parse(readFileSync('path/to/js/map/file', 'utf8'));
const rawSourceMap = JSON.parse(readFileSync(pwd + '/build/static/js/2.bd2fc96c.chunk.js.map', 'utf8'));

// console.log(JSON.parse(readFileSync('./build/static/js/2.bd2fc96c.chunk.js.map', 'utf8')));

SourceMapConsumer.with(rawSourceMap, null, consumer => {
    const pos = consumer.originalPositionFor({
        line: 2,   // 报错的行
        column: 104  // 报错的列
    });

    // console.log(pos);
})

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
 * @param {string} file // 数据文件
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
        this.sourceMapFile = `${pwd}${this.file}`
        this.rawSourceMap = JSON.parse(readFileSync(`${pwd}${this.file}`, 'utf8'));
    }

    public getPos(): Promise<IPos> {
        return SourceMapConsumer.with(this.rawSourceMap, null, consumer => {
            let pos = null
            let resultPos = {}
            try {
                pos = consumer.originalPositionFor({
                    line: this.line,   // 报错的行
                    column: this.column  // 报错的列
                });
            } catch (error) {
              resultPos = {
                status: 'error',
                values: pos
              }
            }
            return resultPos
        })
    }

}

// new SourceMap(2, 104, '/build/static/js/2.bd2fc96c.chunk.js').getPos().then((res: any) => {
//   console.log(res);
// })

// class SourceMap {
//   constructor(rawMap) {
//     this.decode(rawMap);
//     this.rawMap = rawMap
//   }

//   /**
//    *
//    * @param {number} line
//    * @param {number} column
//    */
//   originalPositionFor(line, column){
//     const lineInfo = this.decoded[line];
//     if(!lineInfo){
//       throw new Error(`不存在该行信息:${line}`);
//     }
//     // const columnInfo = lineInfo[column];
//     for(const seg of lineInfo){
//       // 列号匹配
//       if(seg[0] === column){
//         const [column, sourceIdx,origLine, origColumn] = seg;
//         const source = this.rawMap.sources[sourceIdx]
//         const sourceContent = this.rawMap.sourcesContent[sourceIdx];
//         const result = codeFrameColumns(sourceContent, {
//          start: {
//            line: origLine+1,
//            column: origColumn+1
//          }
//         }, {forceColor:true})
//         return {
//           source,
//           line: origLine,
//           column: origColumn,
//           frame: result
//         }
//       }
//     }
//     throw new Error(`不存在该行列号信息:${line},${column}`)
//   }

//   decode(rawMap) {
//     const {mappings} = rawMap
//     const { decode } = require('vlq');
//     console.log('mappings:', mappings);
//     /**
//      * @type {string[]}
//      */
//     const lines = mappings.split(';');
//     const decodeLines = lines.map((line) => {
//       const segments = line.split(',');
//       const decodedSeg = segments.map((x) => {
//         return decode(x);
//       });
//       return decodedSeg;
//     });
//     const absSegment = [0, 0, 0, 0, 0];
//     const decoded = decodeLines.map((line) => {
//       absSegment[0] = 0; // 每行的第一个segment的位置要重置
//       if (line.length == 0) {
//         return [];
//       }
//       const absoluteSegment = line.map((segment) => {
//         const result = [];
//         for (let i = 0; i < segment.length; i++) {
//           absSegment[i] += segment[i];
//           result.push(absSegment[i]);
//         }
//         return result;
//       });
//       return absoluteSegment;
//     });
//     this.decoded = decoded;
//   }
// }

// const consumer = new SourceMap(rawMap);

// console.log(consumer.originalPositionFor(0,21).frame)
