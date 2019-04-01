const fs = require('fs')

// Load config and merge to default config
function loadConfig(configPath, defaultConfig) {
  let config = defaultConfig
  try {
    const userConfig = JSON.parse(fs.readFileSync(configPath))
    config = { ...config, userConfig }
  } catch (err) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, '  '), 'utf-8')
  }
  return config
}

module.exports = {
  loadConfig,
}
