/* eslint-disable no-console */

const { app, BrowserWindow } = require('electron');
const { URL } = require('url');
const path = require('path');
const DiscordRPC = require('discord-rpc');
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
//credit to ShayBox for making me realize moment was a thing
const moment = require('moment');

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
  menu.setMenu(null);
  mainWindow.setMenuBarVisibility(false);
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

const startTime = async () => {
  if(!mainWindow.webContents.getURL().startsWith('https://www.pornhub.com/view_video.php?viewkey=')) return undefined;
  let time = await mainWindow.webContents.executeJavaScript("window.jQuery('span.mhp1138_elapsed').text()");
  let date = new Date();
  const [h, m, s] = time.split(':');
  if(!m) {
    if(h) date.setSeconds(date.getSeconds() - h);
  } else if(!s) {
    if(h) date.setMinutes(date.getMinutes() - h);
    if(m) date.setSeconds(date.getSeconds() - m);
  } else {
    if(h) date.setHours(date.getHours() - h);
    if(m) date.setMinutes(date.getMinutes() - m);
    if(s) date.setSeconds(date.getSeconds() - s);
  }
  return date;
}

const endTime = async () => {
  if(!mainWindow.webContents.getURL().startsWith('https://www.pornhub.com/view_video.php?viewkey=')) return undefined;
  let totTime = await mainWindow.webContents.executeJavaScript("window.jQuery('span.mhp1138_total').text()");
  let time = await mainWindow.webContents.executeJavaScript("window.jQuery('span.mhp1138_elapsed').text()");
  let date = new Date();
  const [h, m, s] = time.split(':');
  if(!m) {
    if(h) date.setSeconds(date.getSeconds() - h);
  } else if(!s) {
    if(h) date.setMinutes(date.getMinutes() - h);
    if(m) date.setSeconds(date.getSeconds() - m);
  } else {
    if(h) date.setHours(date.getHours() - h);
    if(m) date.setMinutes(date.getMinutes() - m);
    if(s) date.setSeconds(date.getSeconds() - s);
  }
  const [ht, mt, st] = totTime.split(':');
  if(!mt) {
    date = moment(date).add(ht, 's').toDate();
  } else if(!st) {
    date = moment(date).add(mt, 's').add(ht, 'm').toDate();
  } else {
    date = moment(date).add(st, 's').add(mt, 'm').add(ht, 'h').toDate();
  }
  return date;
}

const setActivity = async () => {
  if (!rpc || !mainWindow)
    return;
  rpc.setActivity({
    details: titleCheck(),
    startTimestamp: await startTime(),
    endTimestamp: await endTime(),
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
