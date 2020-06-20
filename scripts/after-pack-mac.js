const path = require('path');
const fs = require('fs');
const plist = require('plist');

function loadPlist(plistPath) {
  return plist.parse(fs.readFileSync(plistPath, 'utf-8'));
}

function writePlist(plistPath, obj) {
  const plistBuf = plist.build(obj);
  fs.writeFileSync(plistPath, plistBuf);
}

async function documentTypes() {
  const plistPath = path.resolve(
    __dirname,
    '../dist/mac/Juno.app/Contents',
    'Info.plist',
  );
  const appPlist = loadPlist(plistPath);
  console.log(appPlist);

  appPlist.CFBundleDocumentTypes = [
    {
      CFBundleTypeExtensions: ['ipynb'],
      CFBundleTypeName: 'Jupyter Notebook',
      CFBundleTypeOSTypes: ['***'],
      CFBundleTypeRole: 'Editor',
    },
  ];

  writePlist(plistPath, appPlist);

  console.log('afterPack: Modified bundle types in plist file');
}

exports.default = async () => {
  await documentTypes();
};
