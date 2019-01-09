const { homedir } = require('os')
const { resolve } = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const { argv } = require('yargs')
const { app, dialog, shell, Menu, Tray } = require('electron')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')

// Our modules
const jupyter = require('./jupyter')

// Global instances
let tray = null
let jupyterPID = null
let notebooksQueue = []
let globalConfig = null

log.transports.file.level = 'debug'
autoUpdater.logger = log
autoUpdater.checkForUpdatesAndNotify()

app.on('second-instance', (event, commandLine, workingDirectory) => {
  console.log('second-instance')
  console.log(commandLine)
  const notebooks = commandLine.slice(2)
  openBrowser(notebooks)
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

// Global constants
const userConfigPath = resolve(homedir(), '.junorc.json')
const nbConfigPath = resolve(homedir(), '.jupyter/nbconfig', 'notebook.json')

const defaultConfig = {
  jupyterCommand: '/usr/local/bin/jupyter-notebook',
  jupyterPort: 8888,
  jupyterHome: homedir(),
  openBrowserOnStartup: true,
}

// Load config and merge to default config
function loadConfig() {
  let config
  try {
    const userConfig = require(userConfigPath)
    config = Object.assign(defaultConfig, userConfig)
  } catch (err) {
    config = defaultConfig
    fs.writeFileSync(
      userConfigPath,
      JSON.stringify(config, null, '  '),
      'utf-8'
    )
  }
  return config
}

// Load config
globalConfig = loadConfig()

// Open browser and show notebooks
function openBrowser(notebooks) {
  jupyter.openBrowser(
    notebooks,
    globalConfig.jupyterHome,
    globalConfig.jupyterPort
  )
}

function updateContextMenu(stateText) {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: stateText,
      enabled: false,
    },
    {
      type: 'separator',
    },
    {
      label: 'Open Jupyter Notebook',
      accelerator: 'Command+O',
      click: () => {
        openBrowser([])
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'New Notebook',
      accelerator: 'Command+N',
      click: () => {
        dialog.showSaveDialog(
          {
            title: 'New Notebook',
            defaultPath: resolve(globalConfig.jupyterHome, 'Untitled.ipynb'),
          },
          filepath => {
            if (!filepath) {
              return
            }
            const defaultNotebook = {
              cells: [],
              metadata: {},
              nbformat: 4,
              nbformat_minor: 0, // eslint-disable-line camelcase
            }
            fs.writeFileSync(
              filepath,
              JSON.stringify(defaultNotebook, null, '  ')
            )
            openBrowser([filepath])
          }
        )
      },
    },
    {
      label: 'Notebook Config',
      accelerator: 'Command+J',
      click: () => {
        exec(`open ${nbConfigPath}`)
      },
    },
    {
      label: 'Preferences...',
      accelerator: 'Command+,',
      click: () => {
        exec(`open ${userConfigPath}`)
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Open Documentation',
      click: () => {
        shell.openExternal('https://github.com/uetchy/juno')
      },
    },
    {
      label: 'Send Feedback',
      click: () => {
        shell.openExternal('https://github.com/uetchy/juno/issues/new')
      },
    },
    {
      type: 'separator',
    },
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
  // Hide dock icon
  if (app.dock) {
    app.dock.hide()
  }

  // Setup macOS tray menu
  tray = new Tray(`${__dirname}/build/tray@2x.png`)
  updateContextMenu('Preparing to start')

  // Gather notebooks
  const notebooks = notebooksQueue.concat(argv._)
  notebooksQueue = []

  // Launch or pick up jupyter daemon and get PID
  jupyterPID = jupyter.getJupyterProcess(
    globalConfig.jupyterCommand,
    globalConfig.jupyterHome,
    globalConfig.jupyterPort
  )

  if (jupyterPID) {
    updateContextMenu(`Running on localhost: ${globalConfig.jupyterPort}`)
    // Open browser to show notebooks
    if (notebooks.length > 0 || globalConfig.openBrowserOnStartup) {
      openBrowser(notebooks)
    }
  } else {
    updateContextMenu('Something went wrong. Check your .junorc.json')
  }
})
