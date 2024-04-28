const {
  app,
  BrowserWindow,
  Menu,
  shell,
  ipcMain,
  dialog,
} = require("electron");
const { initialize, enable } = require("@electron/remote/main");
const template = require("./src/utils/menu");
const { join } = require("path");
const ElectronStore = require("electron-store");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");

app.on("ready", () => {
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.on("error", (e) => {
    console.log("Error: ", e === null ? "unknown" : e.stack || e.message);
  });
  autoUpdater.on("update-available", () => {
    dialog.showMessageBoxSync(
      {
        type: "info",
        title: "检查更新",
        message: "发现新版本，是否立即更新？",
        buttons: ["是", "否"],
      },
      (btnI) => {
        if (btnI === 0) {
          autoUpdater.downloadUpdate();
        }
      }
    );
  });
  autoUpdater.on("update-not-available", () => {
    dialog.showMessageBoxSync({
      title: "检查更新",
      message: "当前已是最先版本",
    });
  });

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
    isDev
      ? "http://localhost:5000"
      : `file://${join(__dirname, "./index.html")}`
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
