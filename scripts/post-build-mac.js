const {join} = require('path');
const fs = require('fs');
const plist = require('plist');

const plistPath = join(__dirname, '../dist/Juno-darwin-x64/Juno.app/Contents', 'Info.plist');
const appPlist = plist.parse(fs.readFileSync(plistPath).toString());

appPlist.CFBundleDocumentTypes = [
  {
    CFBundleTypeExtensions: ['ipynb'],
    CFBundleTypeName: 'Jupyter Notebook',
    CFBundleTypeOSTypes: ['***'],
    CFBundleTypeRole: 'Editor'
  }
];
fs.writeFileSync(plistPath, plist.build(appPlist));
