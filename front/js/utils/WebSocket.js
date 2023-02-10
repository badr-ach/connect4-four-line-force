export class WebSocket{
 
    static sockets = new Map();

    static connectToNameSapce(namespace,config){
        const socket = io(namespace,config);
        WebSocket.sockets.set(namespace,socket);
        return socket;
    };

    static getSocket(){
        if(!WebSocket.sockets.has("/")){
            WebSocket.connect()
        };
        return WebSocket.sockets.get("/");
    };

    static getSocketByNameSpace(namespace,config){
        if(!WebSocket.sockets.has(namespace)){
            WebSocket.connectToNameSapce(namespace,config);
        };
        return WebSocket.sockets.get(namespace);
    };
}