const electron   = require("electron");
const filesystem = require("fs");
const path       = require("path");
const Menu       = require("./modules/Menu");
const Storage    = require("./modules/Storage");

require("electron-debug")();
require("electron-dl")();

// Define Basic Process Variables
let mainWindow = null;
let isQuitting = false;


// Check if App is already running.  If so, close this instance
const isAlreadyRunning = electron.app.makeSingleInstance(() => {
	if (!mainWindow)
		return;

	if (mainWindow.isMinimized())
		mainWindow.restore();

	mainWindow.show();
});

if (isAlreadyRunning)
	electron.app.quit();


// Pull Application Settings from Storage and Assign Default Values if Empty (store in global)
function set_default_settings() {
	settings = {
		alarms: [], // Alarm Structure {time: {hours: int, minutes: int}, name: string, repeat: {sun: bool, mon: bool, tues: bool, wed: bool, thurs: bool, fri: bool, sat: bool}, snooze: int, math: bool, randomize: bool, tone: str}
		default_tone: null,
		carousel_wait_time: 15
	}
	Storage.set('settings', settings);
	return settings
}
global.settings = Storage.get('settings') || set_default_settings();


// Read Filesystem to check for Carousel Images (store in global)
global.carousel_items = []

filesystem.readdir(path.join(__dirname, "carousel"), (err, files) => {
	global.carousel_items = files
});


// Create Main Application Render Process / Window
function createMainWindow() {
	// Pull information about last Window Size / Position from Storage
	const lastWindowState = Storage.get("lastWindowState") || {width: 900, height: 675};

	// Basic Window Information
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

	// Define Window Close Behavior.  On Windows / Linux, Quit Application.  On Darwin / macOS, Hide.
	browser.on("close", event => {
		if (isQuitting)
			return;

		event.preventDefault();

		if (process.platform === "darwin")
			electron.app.hide();
		else
			electron.app.quit();
	});

	// Load Main Window Contents from HTML file
	browser.loadURL(path.join(__dirname, "index.html"), {userAgent: ""});

	// Reveal Main Render Process when finished loading
	browser.webContents.on("dom-ready", () => {
		browser.show();
	});

	// In case of External Links, Open them in Browser instead of Application
	browser.webContents.on("new-window", (event, url) => {
		event.preventDefault();
		electron.shell.openExternal(url);
	});

	return browser;
}


// Set the Application Menu (Mostly Applicable to macOS / Darwin)
electron.app.on("ready", () => {
	electron.Menu.setApplicationMenu(Menu);

	if (!mainWindow)
		mainWindow = createMainWindow();
});


// Reveal Main Render Process / Window
electron.app.on("activate", () => {
	if (!mainWindow)
		mainWindow = createMainWindow();

	mainWindow.show();
});


// Store State Information Before Application Finishes Quitting
electron.app.on("before-quit", () => {
	isQuitting = true;

	if (mainWindow && !mainWindow.isFullScreen())
		Storage.set("lastWindowState", mainWindow.getBounds());
});