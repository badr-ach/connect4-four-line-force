import http from "http";
import {parse} from "./url-to-regex.js";
import {queryParse} from "./query-params.js"

function createResponse(res) {
  res.send = (message) => res.end(message);
  res.json = (data) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  };
  return res;
}

function processMiddleware(middleware, req, res) {
  if (!middleware) {
    return new Promise((resolve) => resolve(true));
  }

  return new Promise((resolve) => {
    middleware(req, res, function () {
      resolve(true);
    });
  });
}

function processMiddlewares(middlewares, req, res) {
    return new Promise(async (resolve) => {
        for (let i = 0; i < middlewares.length; i++) {
            const result = await processMiddleware(middlewares[i], req, res);
            if (!result) {
                resolve(false);
                break;
            }
        }
        resolve(true);
    });
}


export function Router() {
  let routeTable = {};
  let parseMethod = "json"; // json, plain text
  let globalMiddleware = [];

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += "" + chunk;
      });
      req.on("end", () => {
        resolve(body);
      });
      req.on("error", (err) => {
        reject(err);
      });
    });
  }

  let server = http.createServer(async(req, res) => {
    const routes = Object.keys(routeTable);
    let match = false;
    for(var i =0; i < routes.length; i++) {
       const route = routes[i];
       const parsedRoute = parse(route);
       console.log("req url",req.url)
       console.log("parsed route",parsedRoute, "Route", route)
       if (
         new RegExp(parsedRoute).test(req.url) &&
         routeTable[route][req.method.toLowerCase()]
       ) {

         console.log("matched", route);
         let cb = routeTable[route][req.method.toLowerCase()];
         let middleware = routeTable[route][`${req.method.toLowerCase()}-middleware`]; 
         const m = req.url.match(new RegExp(parsedRoute));
         req.params = m.groups;
         req.query = queryParse(req.url);

         let body = await readBody(req);
         if (parseMethod === "json") {
          body = body ? JSON.parse(body) : {};
         }
         req.body = body;
         
         const result = await processMiddlewares([...globalMiddleware, ...middleware], req, createResponse(res));
         if (result) {
           cb(req, res);
         } 
         
         match = true;
         break;
       }
    }
    if (!match) {
      res.statusCode = 404;
      res.end("Not found");
    }
  });

  function registerPath(path, cb, method, middleware) {
    if (!routeTable[path]) {
      routeTable[path] = {};
    } 
    routeTable[path] = { ...routeTable[path], [method]: cb, [method + "-middleware"]: [middleware] };
  }


  return {
    getRouteTable: () =>{
        return routeTable;
    },
    get: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0] , "get");
      } else {
        registerPath(path, rest[1], "get", rest[0]);
      }
    },
    post: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0], "post");
      } else {
        registerPath(path, rest[1], "post", rest[0]);
      }
    },
    put: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0], "put");
      } else {
        registerPath(path, rest[1], "put", rest[0]);
      }
    },
    delete: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0], "delete");
      } else {
        registerPath(path, rest[1], "delete", rest[0]);
      }
    },
    bodyParse: (method) => parseMethod = method,
    listen: (port, cb) => {
      server.listen(port, cb);
    },
    use: (middleware) => {
        globalMiddleware = [...globalMiddleware, middleware];
    },
    use: (path, router) => {
        const routeTable = router.getRouteTable();
        const routes = Object.keys(routeTable);
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const methods = Object.keys(routeTable[route]);
            for (let j = 0; j < methods.length; j++) {
                const method = methods[j];
                if (method === "get-middleware" || method === "post-middleware" || method === "put-middleware" || method === "delete-middleware") {
                    continue;
                }
                const cb = routeTable[route][method];
                const middleware = routeTable[route][method + "-middleware"];
                if(!middleware) {
                    registerPath(path + route, cb, method, middleware);
                } else {
                    console.log("um not")
                    registerPath(path + route, cb, method);
                }
            }
        }
    },
    _server: server
  };
}
