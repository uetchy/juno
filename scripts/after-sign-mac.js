const path = require('path')
const assert = require('assert')
const { notarize } = require('electron-notarize')

const appleId = process.env.APPLE_ID
const appleIdPassword = process.env.APPLE_PASSWORD
const ascProvider = process.env.ASC_PROVIDER

const configPath = path.resolve(__dirname, '../package.json')
const appPath = path.resolve(__dirname, '../dist/mac/Juno.app')
const config = require(configPath)
const appBundleId = config.build.appId
const isRelease = !!process.env.RELEASE

async function notarizeApp() {
  console.log(`afterSign: Notarizing ${appBundleId} in ${appPath}`)
  await notarize({
    appBundleId,
    appPath,
    appleId,
    appleIdPassword,
    ascProvider,
  })
  console.log('afterSign: Notarized')
}

exports.default = async () => {
  if (isRelease) {
    assert(appleId, 'Specify APPLE_ID for notarization')
    assert(appleIdPassword, 'Specify APPLE_PASSWORD for notarization')
    assert(ascProvider, 'Specify ASC_PROVIDER for notarization')
    await notarizeApp()
  }
}
