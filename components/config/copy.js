const fs = require('fs-extra')
const NodePath = require('path')

const resolveFile = path => NodePath.resolve(__dirname, path)

class Task {
  constructor() {
    this.resolveFile = resolveFile

    // 样式
    this.styleFile = this.resolveFile("../src/styles")
    this.esStyleFile = this.resolveFile("../es/styles")
    this.libStyleFile = this.resolveFile("../lib/styles")

    // 静态资源
    this.assetsFile = this.resolveFile("../src/assets")
    this.esAssetsFile = this.resolveFile("../es/assets")
    this.libAssetsFile = this.resolveFile("../lib/assets")

    this.copyStyle()
    this.copyAssets()
  }

  // 拷贝styles
  copyStyle() {
    fs.copy(this.styleFile, this.esStyleFile, err => {
      if (err) {
        console.error(err)
        return
      }
      console.log('copy style to es success!')
    })

    fs.copy(this.styleFile, this.libStyleFile, err => {
      if (err) {
        console.error(err)
        return
      }
      console.log('copy style to lib  success!')
    })
  }

  // 拷贝assets
  copyAssets() {
    fs.copy(this.assetsFile, this.esAssetsFile, err => {
      if (err) {
        console.error(err)
        return
      }
      console.log('copy assets to es success!')
    })

    fs.copy(this.assetsFile, this.libAssetsFile, err => {
      if (err) {
        console.error(err)
        return
      }
      console.log('copy assets to lib  success!')
    })
  }
}

new Task()
