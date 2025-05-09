const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getPokemon: (name) => ipcRenderer.invoke('get-pokemon', name)
});
