const { app, BrowserWindow } = require('electron');

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  // win.toggleDevTools();
  win.loadURL('http://localhost:1234');
}

app.on('ready', createWindow);

app.on('window-all-closed', app.quit);
