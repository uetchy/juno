const electron = require('electron')
const {app, Menu, Tray, crashReporter} = electron
const {homedir} = require('os')
const {resolve, relative} = require('path')
const yargs = require('yargs').argv
const jupyter = require('./jupyter')

const JUPYTER_PATH = resolve(homedir(), '.pyenv', 'shims', 'jupyter-notebook')
const port = process.env.JUPYTER_PORT || 8888

let tray = null
let mainWindow = null
let jupyterPID = null
let notebooksToOpen = []

let shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
	const notebooks = argv.slice(2)
	jupyter.openBrowser(notebooks, port)
})

if (shouldQuit) {
  app.quit()
  return
}

app.on('open-file', (event, path) => {
	event.preventDefault()
	if (jupyterPID) {
		jupyter.openBrowser([path], port)
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

	tray = new Tray(`${__dirname}/tray@2x.png`)
  const contextMenu = Menu.buildFromTemplate([
  	{label: 'Jupyter is running on http://localhost:' + port, enabled: false},
    {label: 'Quit', role: 'quit'}
  ])
  tray.setToolTip('Juno is enabled')
  tray.setContextMenu(contextMenu)

  const notebooks = notebooksToOpen.concat(yargs._)
  notebooksToOpen = []

  jupyterPID = jupyter.openJupyterNotebook(JUPYTER_PATH, port)
  jupyter.openBrowser(notebooks, port)
  console.log('jupyterPID:', jupyterPID)
})
