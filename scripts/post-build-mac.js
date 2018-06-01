const { join } = require('path')
const fs = require('fs')
const plist = require('plist')

exports.default = function() {
  const plistPath = join(
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
