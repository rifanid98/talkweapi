/**======================== ExpressJs ============================= */

/**
 * ExpressJs Framework
 */
// import express fw
const express = require('express');
// initiate of express js
const app = express();

/**=========================== Modules ============================ */

/**
 * Modules
 */
// socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// import cors
const cors = require('cors');
// import bodyParser
const bodyParser = require('body-parser');
// import morgan
const morgan = require('morgan');
// import dotenv
require('dotenv').config();

/**
 * Global Root Path
 */
const config = require('./src/configs/global');
const path = require('path');
global.appRoot = path.resolve(__dirname);

/**========================== socket.io =========================== */

/**
 * socket.io config
 * 
 * comment this code if you prefer to not use socket.io
 */
io.on('connection', socket => {
    // Example to get emit from socket.io client
    socket.on('exampleMessage', (message) => {
        console.log(message);
    })
    // Socket.io client disconnect handling
    socket.on('disconnect', () => {
        console.log('disconnect')
    })
    // Force socket.io client disconnect
    socket.disconnect()
});

/**============================= CORS ============================= */

/**
 * CORS Handling
 * .
 * I Mean, Simple CORS Handling!
 */
app.use(cors());

/**============================ Morgan ============================ */

/**
 * Morgan Logging
 */
app.use(morgan('dev'));

/**========================== Body Parser ========================= */

/**
 * Body Parser
 * .
 * Receive jsonUrlEncoded body request
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**============================ Routes ============================ */

/**
 * Static File
 * .
 * Static Public Assets
 */
app.use(`/${config.rootProjectPath}`, express.static("src/assets/"));
// app.use("/libraryapp-api", express.static("src/assets/"));

/**
 * Routes
 * .
 * Load all routes in one file
 */
// Load routes
const routes = require('./src/routes/r_index');
// set the routes
app.use(`/${config.rootProjectPath}`, routes);

/**============================= URLs ============================= */

/**
 * URL Error Handling
 */
// handling error when the url is not found
app.use(function (req, res, next) {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error: {
            status: error.status,
            message: error.message
        }
    });
})

/**============================== MySQL =========================== */

/**
 * Config MySQL
 * .
 * load config mysql
 */
const conn = require('./src/helpers/mysql');
const { disconnect } = require('process');
// connect function
function connect() {
    conn.connect(function (error) {
        if (error) throw error;
        console.log("DB Connected!");
    });
}

/**============================ Server ============================ */

/**
 * Server Start
 */
// Change server.listen() to app.listen() if you
// prefer to not use socket.io
const port = process.env.PORT || 3000;
const host = process.env.HOST;
server.listen(port, host, () => {
    connect();
    console.log("Server is running on port " + port);
});

/**============================== EOL ============================= */