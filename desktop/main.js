const path = require("path");
const { app, BrowserWindow, shell } = require("electron");

const DEFAULT_URL = "https://2048-io.vercel.app/";
const START_URL = process.env.APP_URL || DEFAULT_URL;

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 760,
    backgroundColor: "#faf8ef",
    title: "2048",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.loadURL(START_URL);
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

