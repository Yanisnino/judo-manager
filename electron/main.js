const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const http = require('http');

const PORT = 3000;
let mainWindow = null;
let serverProcess = null;

// ─── Start embedded Next.js standalone server ───────────────────────
function startServer() {
  return new Promise((resolve, reject) => {
    try {
      // In production: resources/app/server.js (standalone Next.js)
      const serverScript = app.isPackaged
        ? path.join(process.resourcesPath, 'app', 'server.js')
        : path.join(__dirname, '..', '.next', 'standalone', 'server.js');

      // Set env vars BEFORE requiring the server
      process.env.PORT = String(PORT);
      process.env.HOSTNAME = 'localhost';
      process.env.NODE_ENV = 'production';

      // The standalone server uses __dirname to find .next and public
      // We need to chdir to the standalone folder
      const serverDir = app.isPackaged
        ? path.join(process.resourcesPath, 'app')
        : path.join(__dirname, '..', '.next', 'standalone');

      process.chdir(serverDir);
      require(serverScript);

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

// ─── Poll until port 3000 is ready ──────────────────────────────────
function waitForServer(maxTries = 30) {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const check = () => {
      tries++;
      const req = http.get(`http://localhost:${PORT}`, () => {
        resolve();
      });
      req.on('error', () => {
        if (tries >= maxTries) {
          reject(new Error('Server did not start in time'));
        } else {
          setTimeout(check, 800);
        }
      });
      req.end();
    };
    check();
  });
}

// ─── Create main window ──────────────────────────────────────────────
function createWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 840,
    minWidth: 1024,
    minHeight: 680,
    title: 'JudoManager Pro',
    autoHideMenuBar: true,
    backgroundColor: '#060b14',
    show: true, // Show window instantly so user knows it launched
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

// ─── App lifecycle ───────────────────────────────────────────────────
app.whenReady().then(async () => {
  try {
    // In dev mode: connect to already-running next dev server
    const isDev = !app.isPackaged;

    if (!isDev) {
      await startServer();
    }

    await waitForServer();
    createWindow(`http://localhost:${PORT}/dashboard`);
  } catch (err) {
    dialog.showErrorBox(
      'خطأ في التشغيل',
      `فشل تشغيل JudoManager Pro.\n\nالتفاصيل: ${err.message}\n\nيرجى إعادة تثبيت البرنامج أو التواصل مع الدعم: 0553823611`
    );
    app.quit();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
