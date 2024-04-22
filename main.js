const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");
const { initialize, enable } = require("@electron/remote/main");
const template = require("./src/utils/menu");
const { join } = require("path");
const ElectronStore = require("electron-store");
const isDev = require("electron-is-dev");

app.on("ready", () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    // backgroundColor: "red",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadURL(
    isDev ? "http://localhost:5000" : `file://${join(__dirname, "./index.html")}`
  );

  enable(win.webContents);
  initialize();

  // 初始化electron-store
  ElectronStore.initRenderer();

  // 自定义顶部菜单
  const menu = Menu.buildFromTemplate(template(app, shell));
  Menu.setApplicationMenu(menu);

  win.on("ready-to-show", () => {
    win.show();
  });
  win.on("closed", () => {
    win = null;
  });

  ipcMain.on("open-settings", () => {
    console.log("Open settings window.");

    let settingsWin = new BrowserWindow({
      width: 400,
      height: 300,
      show: false,
      // backgroundColor: "red",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    settingsWin.loadFile("settings/index.html");
    // settingsWin.loadURL(`file://${join(__dirname, "settings/index.html")}`);

    enable(settingsWin.webContents);

    // 自定义顶部菜单
    const menu = Menu.buildFromTemplate(template(app, shell));
    Menu.setApplicationMenu(menu);

    settingsWin.on("ready-to-show", () => {
      settingsWin.show();
    });
    settingsWin.on("closed", () => {
      settingsWin = null;
    });
  });
});
