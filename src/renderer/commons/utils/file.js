export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const base64 = fileReader.result
      const img = new Image()
      img.onload = () => {
        resolve({
          base64,
          width: img.width,
          height: img.height
        })
      }
      img.onerror = reject
      img.src = base64
    }
    fileReader.onerror = reject
    fileReader.readAsDataURL(file)
  })
}

export function saveGifFile(gif) {
  const remote = require('electron').remote
  const { dialog } = require('electron').remote
  var fs = require('fs')
  var window = remote.getCurrentWindow()
  var options = {
    filters: [
      { name: 'Gif File', extensions: ['gif'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile', 'createDirectory']
  }
  dialog.showSaveDialog(window, options, filename => {
    if (filename) {
      var dataUrl = gif.replace(/^data:image\/gif;base64,/, '')
      fs.writeFile(filename, dataUrl, 'base64', err => {
        if (err) console.log(err)
      })
    }
  })
}
