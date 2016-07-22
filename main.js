const electron = require('electron')
const {app, Menu, Tray, crashReporter} = electron

const {homedir} = require('os')
const {resolve, relative} = require('path')
const jupyter = require('./jupyter')

const JUPYTER_PATH = resolve(homedir(), '.pyenv', 'shims', 'jupyter-notebook')
const port = process.env.JUPYTER_PORT || 8888
const ipynbs = process.argv.slice(2)

let tray = null
let mainWindow = null
let jupyterPID = null

app.on('before-quit', () => {
	console.log("Kill jupyter with SIGHUP:", jupyterPID)
	process.kill(jupyterPID, 'SIGHUP')
})

app.on('ready', () => {
	if (app.dock) app.dock.hide()

	tray = new Tray(`${__dirname}/tray@2x.png`)
  const contextMenu = Menu.buildFromTemplate([
  	{label: 'Jupyter is running on http://localhost:' + port, enabled: false},
    {label: 'Quit', role: 'quit'}
  ])
  tray.setToolTip('Juno is enabled')
  tray.setContextMenu(contextMenu)
  jupyterPID = jupyter.openJupyterNotebook([], JUPYTER_PATH, port)
  console.log('jupyterPID:', jupyterPID)
})
