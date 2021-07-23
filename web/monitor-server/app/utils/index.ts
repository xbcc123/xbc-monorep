import { ISystemInfo } from "../typings"
import { systemInfoList } from "./map"


// 根据该名称 获取到 systemInfo
export const sourceInfoFromName = (name: string): ISystemInfo | undefined => {
  return systemInfoList.find(systemInfo => systemInfo.name === name)
}
