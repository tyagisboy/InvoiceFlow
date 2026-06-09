# Skill Set: Windows Distribution Agent (Electron Apps)

This document contains the standard requirements, configuration patterns, and workarounds for packaging Electron apps into traditional, user-friendly Windows setup installers (`.exe`) compatible with Windows 7 through Windows 11.

---

## 1. Traditional Installer Requirements (NSIS Setup Wizard)

To build a standard Windows installer that behaves like a traditional desktop application, the installer must:
1. **Ask for Location**: Present a setup wizard that allows the user to select the program's installation path.
2. **Default to Program Files**: Install by default into `C:\Program Files\<AppName>` for all users (requires UAC elevation).
3. **Clean Uninstallation**: Register with Windows Programs and Features, allowing the user to cleanly uninstall the app and remove all associated files/directories.

### Configuration (`package.json`)
Use `electron-builder` with the `nsis` target configured as follows:

```json
{
  "build": {
    "appId": "com.invoice.generator",
    "productName": "Invoice Generator",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "index.html",
      "app.js",
      "styles.css",
      "electron-main.cjs",
      "package.json"
    ],
    "win": {
      "target": "nsis"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "perMachine": true,
      "uninstallDisplayName": "Invoice Generator"
    }
  }
}
```

---

## 2. API Geolocation & CORS Requirements (Dual-Layer Functionality)

When running inside a packaged Electron app (`file://` origin), external network requests for geolocation services face strict security blocks.

### CORS Policy Fix
* **Problem**: Outgoing `fetch` requests from `file://` to `https` APIs (e.g., `ipwho.is`) fail due to CORS.
* **Fix**: In `electron-main.cjs`, set `webSecurity: false` in `webPreferences`.

### API User-Agent Block Fix
* **Problem**: OpenStreetMap (Nominatim) blocks requests with generic `Electron` User-Agents.
* **Fix**: Set a custom User-Agent globally in the main process and send it in headers.

```javascript
// In electron-main.cjs
app.userAgentFallback = 'InvoiceFlow/1.0.0 (contact@invoiceflow.com)';

const mainWindow = new BrowserWindow({
  // ...
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    webSecurity: false // Disable CORS check for local API requests
  }
});
```

### Dual-Layer Resilient Geolocating
Ensure `app.js` runs a native GPS request first, then falls back to a primary IP API, and finally a secondary backup IP API.

```javascript
navigator.geolocation.getCurrentPosition(
  (pos) => reverseGeocode(pos.coords.latitude, pos.coords.longitude),
  (err) => {
    // Fallback Layer 1
    fetch('https://ipwho.is/')
      .then(res => res.json())
      .then(data => reverseGeocode(data.latitude, data.longitude))
      .catch(err1 => {
        // Fallback Layer 2 (Backup)
        fetch('https://freeipapi.com/api/json')
          .then(res => res.json())
          .then(data => reverseGeocode(data.latitude, data.longitude))
          .catch(err2 => showToast('Geocoding failed completely.'));
      });
  }
);
```

---

## 3. Build Environment Workarounds (WinCodeSign Symlink Error)

* **Problem**: On Windows, `electron-builder` tries to extract the macOS code-signing tool `winCodeSign.7z` which contains symlinks. This triggers a privilege failure (`A required privilege is not held by the client`) unless the terminal runs as Administrator.
* **Workaround**: Manually copy the extracted folders to the AppData cache path. Once the cache folder exists, `electron-builder` skips the extraction phase, preventing the error.

### Cache Setup Steps:
1. Locate the cache path: `C:\Users\<Username>\AppData\Local\electron-builder\Cache\winCodeSign\`
2. Create the target version folder inside: `winCodeSign-2.6.0`
3. Extract or copy the extracted contents of the `.7z` file (excluding darwin symlinks if desired) directly into this folder.
