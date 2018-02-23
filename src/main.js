/* eslint-disable no-console */

const { app, BrowserWindow } = require('electron');
const { URL } = require('url');
const path = require('path');
const DiscordRPC = require('discord-rpc');
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

let mainWindow;

let createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'Free Porn Videos & Sex Movies - Porno, XXX, Porn Tube | Pornhub',
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'favicon.ico'),
  });

  mainWindow.loadURL('https://www.pornhub.com/');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});


app.on('activate', () => {
  if (mainWindow === null)
    createWindow();
});

const titleCheck = () => {
  let content = [mainWindow.webContents.getTitle(), mainWindow.webContents.getURL()];
  return (content[0] == 'Free Porn Videos & Sex Movies - Porno, XXX, Porn Tube | Pornhub' || content[1].toLowerCase().includes('pornhub.com/video/search?search='))? 'Browsing videos on Pornhub' : content[0].substring(0, content[0].length - 13);
}

const setActivity = async () => {
  if (!rpc || !mainWindow)
    return;
  rpc.setActivity({
    details: titleCheck(),
    largeImageKey: 'phub',
    largeImageText: 'Pornhub <3',
    smallImageKey: 'phub_small',
    smallImageText: 'Pornhub <3',
    instance: false,
  });
}

rpc.on('ready', () => {
  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login('416436034876866560').catch(console.error);
