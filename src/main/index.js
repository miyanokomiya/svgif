'use strict'

import { app, BrowserWindow } from 'electron'
import './store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
function createMainWindow() {
  const winURL =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:9080/main.html`
      : `file://${__dirname}/main.html`
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    recorderWindow.close()
  })
}

let recorderWindow
function createRecorderWindow() {
  const winURL =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:9080/recorder.html`
      : `file://${__dirname}/recorder.html`
  /**
   * Initial window options
   */
  recorderWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    transparent: true
    // alwaysOnTop: true // クリック透過できないので最前面調整は邪魔そう
  })

  // recorderWindow.setIgnoreMouseEvents(true) // 全部透過されてしまう
  recorderWindow.loadURL(winURL)

  recorderWindow.on('closed', () => {
    recorderWindow = null
    mainWindow.close()
  })
}

function createWindow() {
  createMainWindow()
  createRecorderWindow()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */