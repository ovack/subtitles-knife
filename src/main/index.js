'use strict'

import { app, BrowserWindow, globalShortcut } from 'electron'
import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
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
  })
  mainWindow.on('focus', () => {
    // mac下快捷键失效的问题
    if (process.platform === 'darwin') {
      let contents = mainWindow.webContents
      globalShortcut.register('CommandOrControl+C', () => {
        console.log('注册复制快捷键成功')
        contents.copy()
      })
      globalShortcut.register('CommandOrControl+V', () => {
        console.log('注册粘贴快捷键成功')
        contents.paste()
      })
      globalShortcut.register('CommandOrControl+X', () => {
        console.log('注册剪切快捷键成功')
        contents.cut()
      })
      globalShortcut.register('CommandOrControl+A', () => {
        console.log('注册全选快捷键成功')
        contents.selectAll()
      })
    }
  })
  mainWindow.on('blur', () => {
    globalShortcut.unregisterAll() // 注销键盘事件
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
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
