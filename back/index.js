// The http module contains methods to handle http queries.
const http = require('http')
// Let's import our logic.
const fileQuery = require('./queryManagers/front.js')

const apiQuery = require('./queryManagers/api.js');
const { env } = require('process');

const port = 8000 || env.port;

const {Server} = require("socket.io");


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
            apiQuery.manage(request, response);
            // If it doesn't start by /api, then it's a request for a file.
        } else {
            fileQuery.manage(request, response);
        }
    } catch(error) {
        console.log(`error while processing ${request.url}: ${error}`)
        response.statusCode = 400;
        response.end(`Something in your request (${request.url}) is strange...`);
    }
// For the server to be listening to request, it needs a port, which is set thanks to the listen function.

}).listen(3000);

//create a socket server
const io = new Server(server);

io.on('connection', socket => {
    console.log('Client connected');

    socket.on('message', message => {
        console.log(`Received message: ${message}`);
        socket.send(`Echo: ${message}`);

    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017";

MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
    console.log("Connected successfully to server");
    const db = client.db("test");
    client.close();
});
