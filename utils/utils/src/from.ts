import * as _ from "lodash"

export interface GetKeyFromfiledsProps {
    filedName: string
    fileds: string
    symbol: string
}

// 获取 form中 某个字段key 的数组
export const getKeyFromfileds = ({filedName, fileds, symbol = ','}: GetKeyFromfiledsProps) => {
    let keyfileds = []
    keyfileds = Object.keys(fileds).map(item => {
         if(item.split(symbol)[0] === filedName) {
             return {
                keyName: item,
                key: item.split(symbol)[1],
                value: fileds[item],
             }
         } 
    }).filter(item => item)
    return keyfileds
}

export interface ListFromFormProps {
    obj: any
    symbol: string
}

// 将form对象转换成 list
export const listFromForm = ({obj, symbol= ','}: ListFromFormProps): any[] => {
    // 获取行
    let keyList = _.uniq(
        Object.keys(obj).map(item => {
            return item.split(symbol)[1]
        })
    ).filter(item => item)
        .sort((a: any, b: any) => b - a)
    let list = keyList.map(item => {
        return {
            key: item
        }
    })
    list.forEach(item => {
        for (let key in obj) {
            if (item.key === key.split(symbol)[1]) {
                item[key.split(symbol)[0]] = obj[key]
            }
        }
    })
    return list
}

export interface GetFormFieldsFromListProps {
    options: any[]  
    filedsArray: any[]
    symbol: string
}

// 通过list列表 获取form
export const getFormFieldsFromList = ( {options = [], filedsArray = [], symbol = ','}: GetFormFieldsFromListProps ): object => {
    let list = _.cloneDeep(options)
    let formObj = {}
    list.forEach(fileds => {
        for (let filed in fileds) {
            if (filedsArray.includes(filed)) {
                formObj[`${filed}${symbol}${fileds.key}`] = fileds[filed]
            }
        }
    })
    return formObj
}