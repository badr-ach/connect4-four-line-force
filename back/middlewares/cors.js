export const addCors = (request,response,next) => {

    // Website you wish to allow to connect to your server.
    response.setHeader('Access-Control-Allow-Origin', '*');

    if(request.method === "OPTIONS")
    {
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
    }
    // Request methods you wish to allow.
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow.
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Access-Control-Request-Method, Access-Control-Request-Headers, Origin');
    // Set to true if you need the website to include cookies in the requests sent to the API.
    response.setHeader('Access-Control-Allow-Credentials', true);

    next();
}
