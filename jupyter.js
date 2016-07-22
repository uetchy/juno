#!/usr/bin/env node

const {execSync, exec, spawn} = require('child_process')
const {homedir} = require('os')
const {resolve, relative} = require('path')

const JUPYTER_PATH = resolve(homedir(), '.pyenv', 'shims', 'jupyter-notebook')
const port = process.env.JUPYTER_PORT || 8888
const ipynbs = process.argv.slice(2)

function processListening(port) {
	let pid
	try {
		pid = execSync(`sleep 0.5 && lsof -ti :${port}`)
	} catch(err) {
		return null
	}
	return String(pid)
}

function launchJupyter(jupyterPath, targetPath, port) {
	console.log("Launching Jupyter ...")
	const options = [targetPath, `--port=${port}`, '--no-browser']
	const jupyter = spawn(jupyterPath, options, { detached: true })
	// jupyter.stderr.on('data', onLog)
	// jupyter.on('close', onExited)
	return jupyter.pid
}

function openBrowser(notebooks=[], port='8888') {
	if (notebooks.length == 0) {
		exec(`open http://localhost:${port}/tree`)
	} else {
		notebooks.forEach((notebook) => {
			const target = relative(homedir(), notebook)
			exec(`open http://localhost:${port}/notebooks/${target}`)
		})
	}
}

function openJupyterNotebook(jupyterPath, port) {
	// Fetch existing process
	let pid = processListening(port)

	// Launch Jupyter if not existed
	if (!pid) {
		let pid = launchJupyter(jupyterPath, homedir(), port)
		console.log('Started')
	}
	while(!pid) {
		pid = processListening(port)
	}

	return pid
}

module.exports = {
	openBrowser: openBrowser,
	openJupyterNotebook: openJupyterNotebook
}
