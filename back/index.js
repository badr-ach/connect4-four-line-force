// The http module contains methods to handle http queries.
import http from 'http';
import { manageRequest as frontManageRequest} from './queryManagers/front.js';
import { manageRequest as apiManageRequest } from './queryManagers/api.js';
import { env } from 'process';

import { Router } from './utils/server/server.js';
import initSocket from './utils/initSocket.js';


const port = 3000 || env.port;


const app = Router();

app.get("/", frontManageRequest);

app.listen(port, () => {
  console.log("Server started on port " + port);
});

initSocket(app._server);


