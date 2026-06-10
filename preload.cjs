const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadData: (storeName) => ipcRenderer.invoke('load-data', storeName),
  saveData: (storeName, data) => ipcRenderer.invoke('save-data', storeName, data),
  saveImage: (imageName, base64Data) => ipcRenderer.invoke('save-image', imageName, base64Data),
  getStorageStats: () => ipcRenderer.invoke('get-storage-stats')
});
