const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const http = require('http');

let mainWindow;
let serverProcess;
const PORT = 3000;

function checkServerReady(url, maxAttempts = 30, interval = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      attempts++;
      http.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 304 || res.statusCode === 302) {
          resolve(true);
        } else if (attempts < maxAttempts) {
          setTimeout(check, interval);
        } else {
          resolve(false);
        }
      }).on('error', () => {
        if (attempts < maxAttempts) {
          setTimeout(check, interval);
        } else {
          resolve(false);
        }
      });
    };
    check();
  });
}

function startLocalServer() {
  if (process.env.ELECTRON_DEV) {
    return Promise.resolve('http://localhost:3000');
  }

  return new Promise((resolve) => {
    // In standalone build, server.js is in resources/app/server.js
    const serverPath = path.join(process.resourcesPath, 'app', 'server.js');
    
    try {
      serverProcess = fork(serverPath, [], {
        env: { ...process.env, PORT: PORT.toString(), NODE_ENV: 'production' },
        stdio: 'ignore'
      });
    } catch (err) {
      console.error('Failed to fork server process', err);
    }

    const appUrl = `http://localhost:${PORT}/dashboard`;
    checkServerReady(appUrl).then(() => {
      resolve(appUrl);
    });
  });
}

function createWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: 'JudoManager Pro – نظام إدارة أندية الجودو',
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(url);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  const url = await startLocalServer();
  createWindow(url);
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
