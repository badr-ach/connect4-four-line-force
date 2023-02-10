// The http module contains methods to handle http queries.
import http from 'http';
import { manageRequest as frontManageRequest} from './controllers/front.js';
import { addCors } from "./middlewares/cors.js";
import { env } from 'process';
import { Server } from "socket.io";
import { Router } from './utils/server.js';
import initSocket from './routes/socket.js';
import router from './routes/user.js';


const port = 3000 || env.port;


const app = Router();

app.global(addCors);

app.use("/api", router);

app.get("/", frontManageRequest);

app.listen(port, () => {
  console.log("Server started on port " + port);
});

const socket = new Server(app._server);

initSocket(socket);


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://db:27017/";

MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
    console.log("Connected successfully to server");
    const db = client.db("test");
    console.log(db);
    client.close();
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017";

MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
    console.log("Connected successfully to server");
    const db = client.db("test");
    client.close();
});
