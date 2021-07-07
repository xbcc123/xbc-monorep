const fs = require('fs-extra')
const NodePath = require('path')

const resolveFile = path => NodePath.resolve(__dirname, path)
const styleFile = resolveFile("../src/styles")
const esStyleFile = resolveFile("../es/styles")
const libStyleFile = resolveFile("../lib/styles")

fs.copy(styleFile, esStyleFile, err => {
  if (err) {
    console.error(err)
    return
  }
  console.log('copy style to es success!')
})

fs.copy(styleFile, libStyleFile, err => {
  if (err) {
    console.error(err)
    return
  }
  console.log('copy style to lib  success!')
})
