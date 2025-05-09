const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
    
  });

  win.setMenu(null);
  win.maximize();
  win.loadFile('index.html');
}

ipcMain.handle('get-pokemon', async (event, pokemonName) => {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    return {
      name: res.data.name,
      sprite: res.data.sprites.front_default,
      types: res.data.types.map(t => t.type.name)
    };
  } catch (err) {
    return { error: 'Pokémon introuvable' };
  }
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
