const electron   = require("electron");
const filesystem = require("fs");
const path       = require("path");
const Menu       = require("./modules/Menu");
const Storage    = require("./modules/Storage");

require("electron-debug")();
require("electron-dl")();

let mainWindow = null;
let isQuitting = false;

const isAlreadyRunning = electron.app.makeSingleInstance(() => {
	if (!mainWindow)
		return;

	if (mainWindow.isMinimized())
		mainWindow.restore();

	mainWindow.show();
});

if (isAlreadyRunning)
	electron.app.quit();

global.carousel_items = []

filesystem.readdir(path.join(__dirname, "carousel"), (err, files) => {
	global.carousel_items = files
});

function createMainWindow() {
	const lastWindowState = Storage.get("lastWindowState") || {width: 900, height: 675};

	const browser = new electron.BrowserWindow({
		width: lastWindowState.width,
		height: lastWindowState.height,
		x: lastWindowState.x,
		y: lastWindowState.y,
		minWidth: 600,
		minHeight: 450,
		title: electron.app.getName(),
		show: false,
		autoHideMenuBar: true,
		frame: false,
		transparent: true,
	});

	browser.on("close", event => {
		if (isQuitting)
			return;

		event.preventDefault();

		if (process.platform === "darwin")
			electron.app.hide();
		else
			electron.app.quit();
	});

	browser.loadURL(path.join(__dirname, "index.html"), {userAgent: ""});

	browser.webContents.on("dom-ready", () => {
		browser.show();
	});

	browser.webContents.on("new-window", (event, url) => {
		event.preventDefault();
		electron.shell.openExternal(url);
	});

	return browser;
}

electron.app.on("ready", () => {
	electron.Menu.setApplicationMenu(Menu);

	if (!mainWindow)
		mainWindow = createMainWindow();
});

electron.app.on("activate", () => {
	if (!mainWindow)
		mainWindow = createMainWindow();

	mainWindow.show();
});

electron.app.on("before-quit", () => {
	isQuitting = true;

	if (mainWindow && !mainWindow.isFullScreen())
		Storage.set("lastWindowState", mainWindow.getBounds());
});
