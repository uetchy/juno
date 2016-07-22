const electron = require('electron')
const {app, Menu, Tray, crashReporter} = electron
const {homedir} = require('os')
const {resolve, relative} = require('path')
const {exec} = require('child_process')
const fs = require('fs')
const extend = require('extend')
const yargs = require('yargs').argv
const jupyter = require('./jupyter')

const userConfigPath = resolve(homedir(), '.junorc.json')
const defaultConfig = {
	jupyter_command: resolve(homedir(), '.pyenv', 'shims', 'jupyter-notebook'),
	jupyter_port: 8888,
	open_browser_on_startup: true
}
var globalConfig
try {
	let userConfig = require(userConfigPath)
	globalConfig = extend(defaultConfig, userConfig)
} catch(err) {
	fs.writeFileSync(userConfigPath, JSON.stringify(defaultConfig, null, '  '), 'utf-8')
	globalConfig = defaultConfig
}

let tray = null
let mainWindow = null
let jupyterPID = null
let notebooksToOpen = []

const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
	const notebooks = argv.slice(2)
	jupyter.openBrowser(notebooks, globalConfig.jupyter_port)
})

if (shouldQuit) {
  app.quit()
  return
}

function openBrowser(notebooks) {
	jupyter.openBrowser(notebooks, globalConfig.jupyter_port)
}

app.on('open-file', (event, path) => {
	event.preventDefault()
	if (jupyterPID) {
		openBrowser([path])
	} else {
		notebooksToOpen.push(path)
	}
})

app.on('before-quit', () => {
	console.log("Kill jupyter", jupyterPID)
	process.kill(jupyterPID, 'SIGHUP')
})

app.on('ready', () => {
	if (app.dock) app.dock.hide()

	const {jupyter_command, jupyter_port, open_browser_on_startup} = globalConfig

	tray = new Tray(`${__dirname}/assets/tray@2x.png`)
  const contextMenu = Menu.buildFromTemplate([
  	{label: 'Running on localhost:' + jupyter_port, enabled: false},
  	{label: 'Open Jupyter Notebook', click: () => {
  		openBrowser([])
  	}},
  	{label: 'Preferences...', accelerator: 'Command+,', click: () => {
  		exec(`open ${userConfigPath}`)
  	}},
    {label: 'Quit Juno', role: 'quit', accelerator: 'Command+Q'}
  ])
  tray.setToolTip('Juno is enabled')
  tray.setContextMenu(contextMenu)

  const notebooks = notebooksToOpen.concat(yargs._)
  notebooksToOpen = []

  jupyterPID = jupyter.openJupyterNotebook(jupyter_command, jupyter_port)
  if (notebooks){
  	openBrowser(notebooks)
  } else if (open_browser_on_startup) {
  	openBrowser([])
  }
  console.log('jupyterPID:', jupyterPID)
})
