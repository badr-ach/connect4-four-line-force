export class WebSocket{
 
    static sockets = new Map();

    static connect(){
        WebSocket.sockets.set("/", io());
        WebSocket.sockets.get("/").on('connect', () => {
            console.log('Connected to server');
        });
    };

    static connectToNameSapce(namespace){
        WebSocket.sockets.set(namespace,io("localhost:3000"+namespace));
    };

    static getSocket(){
        if(!WebSocket.sockets.has("/")){
            WebSocket.connect()
        };
        return WebSocket.sockets.get("/");
    };

    static getSocketByNameSpace(namespace){
        if(!WebSocket.sockets.has(namespace)){
            WebSocket.connectToNameSapce(namespace);
        };
        return WebSocket.sockets.get(namespace);
    };
}