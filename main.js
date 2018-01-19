    /*! ELECTRON MAIN
     *
     * App Name: ElectronAppBase
     * App Version: 0.1
     * App URL: https://github.com/chanaysavoyen/ElectronAppBase
     *
     * Author: Stephane Chanay-Savoyen
     * Author URL: https://chanaysavoyen.com
     *
     * Licence: MIT
     * Licence URL: https://chanaysavoyen.com/licenses/MIT
     *
     * Thanks to Electron documentation: 
     * https://electronjs.org/docs/tutorial/quick-start
     */
    
    const {
        ipcMain, 
        BrowserWindow, 
        app,
        shell,
        Menu } = require('electron')
    const path = require('path')
    const url = require('url')
    
    //
    // ENVIRONMENT & CONFIG
    //

    // Keep environment variables read-only
    let env = {

        // mode: auto || dev || prod
        LOCAL_STATUS: 'dev'
    }
    
    //
    // MENU
    //

    // Keep menu and menuTemplate
    // inside global constante
    let menu
    let menuTemplate = []
    
    function createMenu () {
        
        // App Menu
        menuTemplate.push({
            submenu: [
                {
                    label: 'About',
                    click () { openAboutWindow() }
                },
                {type: 'separator'},
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    role: 'quit'
                }
            ]
        })
        
        // Edit Menu
        menuTemplate.push({
            label: 'Edit',
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {type: 'separator'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                {role: 'selectall'}
            ]
        })
        
        // Window Menu
        menuTemplate.push({
            role: 'window',
            submenu: [
                {role: 'togglefullscreen'},
                {type: 'separator'},
                {role: 'minimize'},
                {role: 'close'}
            ]
        })
        
        // More Informations only with development mode
        if (env.LOCAL_STATUS === 'dev') {
            menuTemplate.push({
                label: 'Learn more on GitHub',
                click () { shell.openExternal(
                    'https://github.com/chanaysavoyen/AppSamples/ElectronAppBase#readme') }
            })
        }
        
        // Create menu from previous template
        menu = Menu.buildFromTemplate(menuTemplate)

        // Add menu to the application
        Menu.setApplicationMenu(menu)
    }
    
    //
    // MAIN WINDOW
    //

    // Keep a global reference of window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    let mainWindow

    function  createMainWindow () {

        // Create the browser window
        mainWindow = new BrowserWindow({
            width: 800, 
            height: 600
        })
        
        // Disable DevTools on production mode
        if (env.LOCAL_STATUS === 'prod') {
            mainWindow.webPreferences = { devTools: false }
        }

        // Define main file
        mainFile = 'index.html'

        // Load file
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, mainFile),
            protocol: 'file:',
            slashes: true
        }))

        // Open the DevTools
        // Only with developement mode
        // (oppened in a new window)
        if (env.LOCAL_STATUS === 'dev') {
            mainWindow.webContents.openDevTools({
                mode:'undocked'
            })
        }
        
        // This script run when the window is closed
        mainWindow.on('closed', () => {
            
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi window, this is the time 
            // when you should delete the corresponding element.
            mainWindow = null
        })
    }
    
    //
    // ABOUT WINDOW
    //

    // Keep a global reference of window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    let aboutWindow
    
    function createAboutWindow () {
        
        // Create the browser window
        aboutWindow = new BrowserWindow({
            width: 800, 
            height: 600
        })
        
        // Disable DevTools on production mode
        if (env.LOCAL_STATUS === 'prod') {
            aboutWindow.webPreferences = { devTools: false }
        }

        // Define about file
        aboutFile = 'about.html'

        // Load file
        aboutWindow.loadURL(url.format({
            pathname: path.join(__dirname, aboutFile),
            protocol: 'file:',
            slashes: true
        }))

        // Open the DevTools
        // Only with developement mode
        // (oppened in a new window)
        if (env.LOCAL_STATUS === 'dev') {
            aboutWindow.webContents.openDevTools({
                mode:'undocked'
            })
        }
        
        // This script run when the window is closed
        aboutWindow.on('closed', () => {
            
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi window, this is the time 
            // when you should delete the corresponding element.
            aboutWindow = null
        })
    }

    function openAboutWindow () {
        
        // Open window if not already
        if (aboutWindow === null) {
            createAboutWindow()
        }
    }

    //
    // APP EVENT LISTENER
    //
    
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', () => {
        
        // Define the path to the application
        env.APP_PATH = app.getAppPath()
        
        // Create menu
        // if not, only 'Quit' menu item is shown
        createMenu()
        
        // Create window
        createMainWindow()
    })

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        // with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        
        // On MacOS, it is common to re-create an application window 
        // when the dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createMainWindow()
        }
    })
    
    //
    // INTERFACE
    //
    
    // Return environment variables (read-only)
    ipcMain.on('getEnv', (event, arg) => {
        event.returnValue = env
    })
    
    // Open about window
    //ipcMain.on('openAboutWindow', (event, arg) => {
    //    openAboutWindow()
    //})