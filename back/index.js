// The http module contains methods to handle http queries.
import http from 'http';
import { manageRequest as frontManageRequest} from './utils/front.js';
import { addCors, manageRequest as apiManageRequest } from './utils/api.js';
import { env } from 'process';

import { Router } from './utils/server/server.js';
import initSocket from './utils/initSocket.js';
import router from './routes/user.js';


const port = 3000 || env.port;


const app = Router();

app.global(addCors);

app.use("/api", router);

app.get("/", frontManageRequest);

app.listen(port, () => {
  console.log("Server started on port " + port);
});

initSocket(app._server);


