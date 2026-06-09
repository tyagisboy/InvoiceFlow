const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// Set a custom User-Agent globally to prevent APIs (like Nominatim) from blocking requests
app.userAgentFallback = 'InvoiceFlow/1.0.0 (contact@invoiceflow.com)';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, 'icon.ico'), // Generic fallback, though we don't have one right now
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // Bypass CORS restrictions for local file:// API requests
    }
  });

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');
  
  // Remove the default menu bar for a cleaner app look
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'geolocation') {
      callback(true);
    } else {
      callback(false);
    }
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
