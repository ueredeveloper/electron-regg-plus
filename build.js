require('dotenv').config()
process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false'

const { build } = require('electron-builder')

build({
  publish: 'always',
  targets: require('electron-builder').Platform.WINDOWS.createTarget(['portable'], require('electron-builder').Arch.x64)
}).catch(err => {
  console.error(err)
  process.exit(1)
})
