![Juno](http://randompaper.co.s3.amazonaws.com/juno/header.png)

[![GitHub release](https://img.shields.io/github/release/uetchy/juno.svg?maxAge=2592000)](https://github.com/uetchy/juno/releases/latest)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/uetchy/juno/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/uetchy/juno.svg)](https://github.com/uetchy/juno/issues)
[![Join the chat at https://gitter.im/uetchy/juno](https://badges.gitter.im/uetchy/juno.svg)](https://gitter.im/uetchy/juno?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/uetchy/juno.svg?branch=master)](https://travis-ci.org/uetchy/juno)
[![Twitter](https://img.shields.io/twitter/url/http/github.com/uetchy/juno.svg?style=social)](https://twitter.com/intent/tweet?text=Jupyter%20Notebook%20stays%20on%20macOS%20menubar.&url=https://github.com/uetchy/juno)

Jupyter Notebook stays on macOS menubar. Powered by Electron.

![](http://randompaper.co.s3.amazonaws.com/juno/screenshot.png)

![](http://randompaper.co.s3.amazonaws.com/juno/open-with-juno.png)

## Download

See [releases](https://github.com/uetchy/juno/releases) and download the app.

### Supported platforms

* macOS

## Requirements

* Jupyter Notebook

### How to install Jupyter Notebook

```
$ brew install python3
$ pip3 install jupyter
$ jupyter notebook
```

## Config

Juno config is located on `~/.junorc.json`.

default parameters are here:

```json
{
  "jupyterCommand": "/usr/local/bin/jupyter-notebook",
  "jupyterPort": 8888,
  "jupyterHome": "~",
  "openBrowserOnStartup": true
}
```

### JupyterLab

You can also specify `/usr/local/bin/jupyter-lab` to `jupyterCommand` to use
Jupyter Lab (you may also want to install `jupyterlab` via `pip3 install jupyterlab`.)

### pyenv

Put `~/.pyenv/shims/jupyter` into `jupyterCommand` if you are on pyenv-enabled
environment.

## Launch Juno from Terminal

Add `juno` command to open Jupyter notebooks from Terminal. Put following code
to your shell config file.

```bash
juno() {
  open -a Juno $1
}
```

to open a notebook:

```
juno "Untitled.ipynb"
```

## Bugs

Feel free to [report issues](https://github.com/uetchy/juno/issues/new) you find
with Juno.

## Roadmap

* [x] Launch Juno in specified directory
* [x] Terminal integration
* [x] Test suite
* [ ] Auto update

## Development Installation

```
$ npm install
$ npm start
```

### Test & Build

Just run:

```
$ npm run release
```

or:

```
$ npm test
$ npm run build
```

Builds the app for OS X, Linux, and Windows, using
[electron-packager](https://github.com/maxogden/electron-packager).

## License

MIT © [Yasuaki Uechi](y@uechi.io)
