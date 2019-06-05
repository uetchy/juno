const path = require('path')
const fs = require('fs')
const plist = require('plist')

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

  console.log('afterPack: Modified bundle types in plist file')
}

exports.default = async () => {
  await documentTypes()
}
