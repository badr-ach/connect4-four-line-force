// The http module contains methods to handle http queries.
import { manageRequest as frontManageRequest} from './controllers/front.js';
import { addCors } from "./middlewares/cors.js";
import { env } from 'process';
import { Server } from "socket.io";
import { Router } from './utils/express/server.js';
import initSocket from './socket.js';
import router from './routes/user.js';


const port = 8000 || env.port;

const app = Router();

app.global(addCors);

app.options("/", (req, res) => { res.status(200).end();});

app.use("/api", router);

app.get("/", frontManageRequest);

app.listen(port, () => {
  console.log("Server started on port " + port);
});

const socket = new Server(app._server,{
  cors: {
      origin: '*',
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
  }
});

initSocket(socket);



