// The http module contains methods to handle http queries.
// const http = require('http');

import http from 'http';
import fileQuery from './queryManagers/front.js';
import apiQuery from './queryManagers/api.js';
import { env } from 'process';
import { WebSocket } from './utils/WebSocket.js';

// Let's import our logic.
// const fileQuery = require('./queryManagers/front.js');
// const apiQuery = require('./queryManagers/api.js');
// const {Server} = require("socket.io");
// const { env } = require('process');
// const { WebSocket } = require('./utils/WebSocket.js');




const port = 3000 || env.port;

/* The http module contains a createServer function, which takes one argument, which is the function that
** will be called whenever a new request arrives to the server.
 */
let server = http.createServer(function (request, response) {
    // First, let's check the URL to see if it's a REST request or a file request.
    // We will remove all cases of "../" in the url for security purposes.
    let filePath = request.url.split("/").filter(function(elem) {
        return elem !== "..";
    });

    try {
        // If the URL starts by /api, then it's a REST request (you can change that if you want).
        if (filePath[1] === "api") {
            apiQuery(request, response);
            // If it doesn't start by /api, then it's a request for a file.
        } else {
            fileQuery(request, response);
        }
    } catch(error) {
        console.log(`error while processing ${request.url}: ${error}`)
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
// For the server to be listening to request, it needs a port, which is set thanks to the listen function.

}).listen(port);


//create a socket server
WebSocket.connect(server);

//attach an event listener to the socket server
WebSocket.attachEventListener("connection", (socket) => {
    console.log("client connected to the socket server");
    socket.on('message', message => {
        console.log(`Received message: ${message}`);
        socket.send(`Echo: ${message}`);

    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});