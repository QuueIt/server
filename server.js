#!/usr/bin/env node

/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var debug = require('debug')('quueit:server');
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser')
var redisServer = require('./redis');
var db = require("./db.js");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

global.REQUEST = require('./helpers/codes.json');

var addRequestId = require('express-request-id')();
app.use(addRequestId)

morgan.token('id', (req) => req.id.split('-')[0])

app.use(morgan("[:date[iso] #:id] Started :method :url for :remote-addr"))

app.use(morgan("[:date[iso] #:id] Completed :status :res[content-length] in :response-time ms"))

/**
 * Create HTTP server.
 */

var server = null;

/**
 * Listen on provided port, on all network interfaces.
 */

db.connect(function (err, mongo) {
    if (err) {
        process.exit(-1);
    }

    // Initialize the database
    db.init(function (err) {
        if (err) {
            process.exit(-1);
        }

        redisServer.init(function(redisCon) {            
        
            app.use(function (req, res, next) {
                console.log("Incoming Request Params", req.params);
                console.log("Incoming Request Body", req.body);
                req.db = mongo;
                req.redis = redisCon;
                next();
            });

            // Load the routes    
            var router = require('./routes.js');
            app.use('/api/v1', router);

            server = http.createServer(app);
            server.listen(port);
            server.on('error', onError);
            server.on('listening', onListening);

        });        
    });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}



/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {    
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('Server is Listening on', addr.port);
}