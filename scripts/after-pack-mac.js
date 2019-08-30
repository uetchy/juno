const path = require('path')
const fs = require('fs')
const bplist = require('bplist')

function loadPlist(plistPath) {
  return new Promise((resolve, reject) => {
    bplist.parseFile(plistPath, (err, object) => {
      if (err) {
        return reject(err)
      }
      resolve(object[0])
    })
  })
}

function writePlist(plistPath, obj) {
  const plistBuf = bplist.create(obj)
  fs.writeFileSync(plistPath, plistBuf)
}

async function documentTypes() {
  const plistPath = path.resolve(
    __dirname,
    '../dist/mac/Juno.app/Contents',
    'Info.plist'
  )
  const appPlist = await loadPlist(plistPath)

  appPlist.CFBundleDocumentTypes = [
    {
      CFBundleTypeExtensions: ['ipynb'],
      CFBundleTypeName: 'Jupyter Notebook',
      CFBundleTypeOSTypes: ['***'],
      CFBundleTypeRole: 'Editor',
    },
  ]

  writePlist(plistPath, appPlist)

  console.log('afterPack: Modified bundle types in plist file')
}

exports.default = async () => {
  await documentTypes()
}
