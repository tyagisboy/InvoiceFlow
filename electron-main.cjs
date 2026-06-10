const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Set a custom User-Agent globally to prevent APIs (like Nominatim) from blocking requests
app.userAgentFallback = 'InvoiceFlow/1.0.0 (contact@invoiceflow.com)';

// Determine active directory for storing files
const isDev = !app.isPackaged;
const dataPath = isDev 
  ? path.join(__dirname, 'data') 
  : path.join(app.getPath('userData'), 'data');
const imagesPath = path.join(dataPath, 'images');

// Helper to ensure directories exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// IPC Handlers for Local Filesystem Storage
ipcMain.handle('load-data', async (event, storeName) => {
  const filePath = path.join(dataPath, `${storeName}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`Failed to read data for ${storeName}:`, e);
    return null;
  }
});

ipcMain.handle('save-data', async (event, storeName, data) => {
  ensureDir(dataPath);
  const filePath = path.join(dataPath, `${storeName}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(`Failed to save data for ${storeName}:`, e);
    return false;
  }
});

ipcMain.handle('save-image', async (event, imageName, base64Data) => {
  ensureDir(imagesPath);
  
  if (!base64Data) {
    // Delete existing files matching imageName if base64Data is empty
    const files = fs.readdirSync(imagesPath);
    for (const file of files) {
      if (file.startsWith(imageName + '.')) {
        try {
          fs.unlinkSync(path.join(imagesPath, file));
        } catch (e) {
          console.error(`Failed to delete image file ${file}:`, e);
        }
      }
    }
    return '';
  }

  // Extract content-type and extension
  const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!matches) {
    // If it's already a saved path/URL, return it as is
    return base64Data;
  }

  let ext = matches[1];
  if (ext === 'jpeg') ext = 'jpg';
  if (ext === 'svg+xml') ext = 'svg';

  const rawData = matches[2];
  const buffer = Buffer.from(rawData, 'base64');

  // Delete older matching image files with different extensions
  const files = fs.readdirSync(imagesPath);
  for (const file of files) {
    if (file.startsWith(imageName + '.')) {
      try {
        fs.unlinkSync(path.join(imagesPath, file));
      } catch (e) {
        // Ignore files that cannot be unlinked
      }
    }
  }

  const fileName = `${imageName}.${ext}`;
  const filePath = path.join(imagesPath, fileName);

  try {
    fs.writeFileSync(filePath, buffer);
    // Return a local file protocol URL
    return `file://${filePath.replace(/\\/g, '/')}`;
  } catch (e) {
    console.error(`Failed to write image file ${fileName}:`, e);
    throw e;
  }
});

ipcMain.handle('get-storage-stats', async () => {
  ensureDir(dataPath);
  let totalBytes = 0;

  function calculateSize(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        calculateSize(filePath);
      } else {
        totalBytes += stats.size;
      }
    }
  }

  try {
    calculateSize(dataPath);
    return {
      bytesUsed: totalBytes,
      dataPath: dataPath
    };
  } catch (e) {
    console.error('Failed to calculate storage size:', e);
    return { bytesUsed: 0, dataPath: dataPath };
  }
});

function createWindow() {
  ensureDir(dataPath);
  ensureDir(imagesPath);

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.cjs')
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
