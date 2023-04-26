export class WebSocket{
 
    static sockets = new Map();

    static connectToNameSapce(namespace,config){
        const socket = io("ws://13.39.75.52"+namespace,config,{ autoConnect: false });
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