# :rocket: Juno

Jupyter Notebook stays on macOS menubar.

![](http://randompaper.co.s3.amazonaws.com/juno/screenshot.png)

## Download

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
