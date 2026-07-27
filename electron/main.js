const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: 'JudoManager Pro - نظام إدارة أندية الجودو والرياضات القتالية',
    icon: path.join(__dirname, '../public/icon.svg'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load local Next.js dev server or production URL
  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000/dashboard';
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', function () {
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
