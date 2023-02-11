// The http module contains methods to handle http queries.
import http from 'http';
import { manageRequest as frontManageRequest} from './controllers/front.js';
import { addCors } from "./middlewares/cors.js";
import { env } from 'process';
import { Server } from "socket.io";
import { Router } from './utils/server.js';
import initSocket from './routes/socket.js';
import router from './routes/user.js';
//import { Db } from './models/db.js';
import { MongoClient} from "mongodb";
import { UserModal } from './models/user.js';
import User from "./routes/user.js";


const port = 3000 || env.port;


const app = Router();

app.global(addCors);

app.use("/api", router);

app.get("/", frontManageRequest);

app.listen(port, () => {
  console.log("Server started on port " + port);
});




/*
UserModal.connectDB();
UserModal.db = UserModal.getClient().db("test");
UserModal.collection = UserModal.db.collection("users");*/
/*
const url = 'mongodb://admin:admin@mongodb:27017/admin?directConnection=true';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
async function createDatabaseAndUser() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db("test");
    const usersCollection = db.collection("test");
    const values = { message: "Hello, world!" };
    const result = await usersCollection.insertOne(values);
    console.log('Document inserted', result.insertedId);
  } catch (err) {
    console.error('Failed to create database or user', err);
  } finally {
    await client.close();
  }
}
createDatabaseAndUser();*/
/*
const uri = "mongodb://localhost:27017";

MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
    console.log("Connected successfully to database");
    const db = client.db("test");
    client.close();
    if(err){
        console.log("erreur dbbbb ",err);
    }
});
*/

const socket = new Server(app._server);

initSocket(socket);



