const path = require('path')
const fs = require('fs')
const plist = require('plist')
const { notarize } = require('electron-notarize')

const configPath = path.resolve(__dirname, '../package.json')
const config = require(configPath)

const appleId = process.env.APPLE_ID
const appleIdPassword = process.env.APPLE_PASSWORD
const appPath = path.resolve(__dirname, '../dist/mac/Juno.app')
const appBundleId = config.build.appId

async function notarizeApp() {
  console.log(appBundleId, appPath, appleId, appleIdPassword)
  await notarize({
    appBundleId,
    appPath,
    appleId,
    appleIdPassword,
  })
}

async function documentTypes() {
  const plistPath = path.resolve(
    __dirname,
    '../dist/mac/Juno.app/Contents',
    'Info.plist'
  )
  const appPlist = plist.parse(fs.readFileSync(plistPath).toString())

  appPlist.CFBundleDocumentTypes = [
    {
      CFBundleTypeExtensions: ['ipynb'],
      CFBundleTypeName: 'Jupyter Notebook',
      CFBundleTypeOSTypes: ['***'],
      CFBundleTypeRole: 'Editor',
    },
  ]

  fs.writeFileSync(plistPath, plist.build(appPlist))

  console.log('Modified bundle types in plist file')
}

exports.default = async () => {
  await documentTypes()
}
