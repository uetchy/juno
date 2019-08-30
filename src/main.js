const { homedir } = require('os')
const { resolve } = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const { app, dialog, shell, Menu, Tray } = require('electron')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const jupyter = require('./jupyter')

// Global instances
let tray = null
let jupyterPID = null
let notebooksQueue = []
let globalConfig = null

log.transports.file.level = 'debug'
autoUpdater.logger = log
autoUpdater.checkForUpdatesAndNotify()

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

// Global constants
const defaultConfig = {
  jupyterCommand: '/usr/local/bin/jupyter-notebook',
  jupyterPort: 8888,
  jupyterHome: homedir(),
  openBrowserOnStartup: true,
  preferLab: false,
}
const userConfigPath = resolve(homedir(), '.junorc.json')
const nbConfigPath = resolve(homedir(), '.jupyter/nbconfig', 'notebook.json')

// Load config
globalConfig = loadConfig(userConfigPath, defaultConfig)

app.on('second-instance', (event, commandLine, workingDirectory) => {
  console.log('second-instance')
  console.log(commandLine)
  const notebooks = commandLine.slice(2)
  openBrowser(notebooks)
})

// Load config and merge to default config
function loadConfig(configPath, defaultConfig) {
  let config = defaultConfig
  try {
    const userConfig = JSON.parse(fs.readFileSync(configPath))
    config = { ...config, ...userConfig }
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(
        configPath,
        JSON.stringify(defaultConfig, null, '  '),
        'utf-8'
      )
    } else {
      throw err
    }
  }
  return config
}

// Open browser and show notebooks
function openBrowser(notebooks, lab) {
  jupyter.openBrowser(
    notebooks,
    globalConfig.jupyterHome,
    globalConfig.jupyterPort,
    lab || globalConfig.preferLab
  )
}

function openSaveDialog() {
  dialog.showSaveDialog(
    {
      title: 'New Notebook',
      defaultPath: resolve(globalConfig.jupyterHome, 'Untitled.ipynb'),
    },
    (filepath) => {
      if (!filepath) {
        return
      }
      const defaultNotebook = {
        cells: [],
        metadata: {},
        nbformat: 4,
        nbformat_minor: 0, // eslint-disable-line camelcase
      }
      fs.writeFileSync(filepath, JSON.stringify(defaultNotebook, null, '  '))
      openBrowser([filepath])
    }
  )
}

function updateContextMenu(stateText) {
  const SEPARATOR = {
    type: 'separator',
  }
  const contextMenu = Menu.buildFromTemplate([
    {
      label: stateText,
      enabled: false,
    },
    SEPARATOR,
    {
      label: 'Open Jupyter Notebook',
      accelerator: 'Command+O',
      click: () => openBrowser([], false),
    },
    {
      label: 'Open Jupyter Lab',
      accelerator: 'Command+L',
      click: () => openBrowser([], true),
    },
    SEPARATOR,
    {
      label: 'New Notebook',
      accelerator: 'Command+N',
      click: () => openSaveDialog(),
    },
    {
      label: 'Notebook Config',
      accelerator: 'Command+J',
      click: () => exec(`open ${nbConfigPath}`),
    },
    {
      label: 'Preferences...',
      accelerator: 'Command+,',
      click: () => exec(`open ${userConfigPath}`),
    },
    SEPARATOR,
    {
      label: 'Open Documentation',
      click: () => shell.openExternal('https://github.com/uetchy/juno'),
    },
    {
      label: 'Send Feedback',
      click: () =>
        shell.openExternal('https://github.com/uetchy/juno/issues/new'),
    },
    SEPARATOR,
    {
      label: 'Quit Juno',
      role: 'quit',
      accelerator: 'Command+Q',
    },
  ])
  tray.setToolTip(stateText)
  tray.setContextMenu(contextMenu)
}

// Open browser when files are passed
app.on('open-file', (event, path) => {
  console.log('open-file', path)
  event.preventDefault()
  if (jupyterPID) {
    openBrowser([path])
  } else {
    notebooksQueue.push(path)
  }
})

// Kill jupyter daemon when quitting
app.on('before-quit', () => {
  process.kill(jupyterPID, 'SIGHUP')
})

// Initialize app
app.on('ready', () => {
  console.log('ready')
  // Hide dock icon
  if (app.dock) {
    app.dock.hide()
  }

  tray = new Tray(`${__dirname}/build/tray@2x.png`)
  updateContextMenu('Starting Jupyter instance')

  // Gather notebooks
  const notebooks = notebooksQueue.concat(process.argv.slice(2))
  notebooksQueue = []

  // Launch or pick up jupyter daemon and get PID
  jupyterPID = jupyter.getJupyterProcess(
    globalConfig.jupyterCommand,
    globalConfig.jupyterHome,
    globalConfig.jupyterPort
  )

  if (jupyterPID) {
    updateContextMenu(`Running on localhost:${globalConfig.jupyterPort}`)
    // Open browser to show notebooks
    if (notebooks.length > 0 || globalConfig.openBrowserOnStartup) {
      openBrowser(notebooks)
    }
  } else {
    updateContextMenu('Something went wrong. Check your .junorc.json')
  }
})
