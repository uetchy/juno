const path = require('path');
const assert = require('assert');
const {notarize} = require('electron-notarize');

const appleApiKey = process.env.APPLE_API_KEY;
const appleApiIssuer = process.env.APPLE_API_ISSUER;
const ascProvider = process.env.ASC_PROVIDER;

const configPath = path.resolve(__dirname, '../package.json');
const appPath = path.resolve(__dirname, '../dist/mac/Juno.app');
const config = require(configPath);
const appBundleId = config.build.appId;
const isRelease = !!process.env.RELEASE;

async function notarizeApp() {
  console.log(`afterSign: Notarizing ${appBundleId} in ${appPath}`);
  await notarize({
    appBundleId,
    appPath,
    // ascProvider,
    appleApiKey,
    appleApiIssuer,
  });
  console.log('afterSign: Notarized');
}

exports.default = async () => {
  if (isRelease) {
    assert(appleApiKey);
    assert(appleApiIssuer);
    assert(ascProvider);
    await notarizeApp();
  }
};
