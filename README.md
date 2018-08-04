![Juno](http://uechi-public.s3-website-ap-northeast-1.amazonaws.com/github/juno/header.png)

[![GitHub release](https://img.shields.io/github/release/uetchy/juno.svg?maxAge=2592000)](https://github.com/uetchy/juno/releases/latest)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/uetchy/juno/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/uetchy/juno.svg)](https://github.com/uetchy/juno/issues)
[![Join the chat at https://gitter.im/uetchy/juno](https://badges.gitter.im/uetchy/juno.svg)](https://gitter.im/uetchy/juno?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/uetchy/juno.svg?branch=master)](https://travis-ci.org/uetchy/juno)
[![Twitter](https://img.shields.io/twitter/url/http/github.com/uetchy/juno.svg?style=social)](https://twitter.com/intent/tweet?text=☄️%20A%20minimal%20app%20serving%20Jupyter%20Notebook%20on%20macOS%20menubar.&url=https://github.com/uetchy/juno)

Jupyter Notebook stays on macOS menubar.

![](http://uechi-public.s3.amazonaws.com/github/juno/screenshot.png)

![](http://uechi-public.s3.amazonaws.com/github/juno/open-with-juno.png)

## Download

See [releases](https://github.com/uetchy/juno/releases).

### Supported platforms

- macOS

## Requirements

- Jupyter Notebook

### How to install Jupyter Notebook

```
$ brew install python3
$ pip3 install jupyter
$ jupyter notebook
```

## Config

Juno config is located on `~/.junorc.json`.

default parameters are:

```json
{
  "jupyterCommand": "/usr/local/bin/jupyter-notebook",
  "jupyterPort": 8888,
  "jupyterHome": "~",
  "openBrowserOnStartup": true
}
```

### JupyterLab

You can also specify `/usr/local/bin/jupyter-lab` to `jupyterCommand` to utilize
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

Feel free to [report issues](https://github.com/uetchy/juno/issues/new).

## Roadmap

- [x] Launch Juno in specified directory
- [x] Terminal integration
- [x] Test suite
- [x] Auto update

## Development Installation

```
$ npm install
$ npm start
```

### Test & Build

```
$ npm test
$ npm run build
```

## License

MIT © [Yasuaki Uechi](y@uechi.io)
