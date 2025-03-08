const path = require('path');
const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const net = require('net');
const express = require('express');
const http = require('http');

const isMac = process.platform === 'darwin';

// Create an Express app to serve static files from the build folder
const server = express();
server.use(express.static(path.join(__dirname, 'frontend/dist')));

// Create the HTTP server
const httpServer = http.createServer(server);
const frontendPort = 3000;  // Port for the frontend (build)

httpServer.listen(frontendPort, () => {
    console.log(`Frontend server running on http://localhost:${frontendPort}`);
});

// Function to create the main application window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Library System',
        width: 1200,
        height: 650,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: true,
            webSecurity: false,
        },
        icon: path.join(__dirname, 'whlogo.png')
    });

    const startUrl = `http://localhost:${frontendPort}`;
    const devUrl = `http://localhost:5173`
    mainWindow.loadURL(startUrl);
}

// Function to check if the backend port is already in use

// When the app is ready, start the backend server and create the main window
app.whenReady().then(async () => {
    createMainWindow();
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

// On macOS, re-create the window if the app is activated and no windows are open
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

// Handle app quitting and gracefully shut down the backend server