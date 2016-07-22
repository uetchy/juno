![Juno](http://randompaper.co.s3.amazonaws.com/juno/header.png)
[![GitHub release](https://img.shields.io/github/release/uetchy/juno.svg?maxAge=2592000)](https://github.com/uetchy/juno/releases/latest) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/uetchy/juno/master/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/uetchy/juno.svg)](https://github.com/uetchy/juno/stargazers) [![GitHub issues](https://img.shields.io/github/issues/uetchy/juno.svg)](https://github.com/uetchy/juno/issues) [![Join the chat at https://gitter.im/uetchy/juno](https://badges.gitter.im/uetchy/juno.svg)](https://gitter.im/uetchy/juno?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Twitter](https://img.shields.io/twitter/url/http/github.com/uetchy/juno.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)

Jupyter Notebook stays on macOS menubar.

![](http://randompaper.co.s3.amazonaws.com/juno/screenshot.png)

## Download

[![Join the chat at https://gitter.im/uetchy/juno](https://badges.gitter.im/uetchy/juno.svg)](https://gitter.im/uetchy/juno?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

See [releases](https://github.com/uetchy/juno/releases) and download the app.

### Supported platforms

- macOS

## Technology

- NodeJS
- Electron

## Config

Juno config is located on `~/.junorc.json`.

default parameters are here:
```json
{
  "jupyter_command": "~/.pyenv/shims/jupyter-notebook",
  "jupyter_port": 8888,
  "open_browser_on_startup": true
}
```

## Bugs

Feel free to [report issues](https://github.com/uetchy/juno/issues/new) you find with Juno.

## Upcoming

- [ ] Add test
- [ ] Auto update

## Dev

```
$ npm install
$ npm start
```

### Build

```
$ npm run build
```

Builds the app for OS X, Linux, and Windows, using [electron-packager](https://github.com/maxogden/electron-packager).


## License

MIT © [Yasuaki Uechi](https://randompaper.co)
