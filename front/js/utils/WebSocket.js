export class WebSocket{
 
    static sockets = new Map();

    // static connect(){
    //     WebSocket.sockets.set("/", io());
    //     WebSocket.sockets.get("/").on('connect', () => {
    //         console.log('Connected to server');
    //     });
    // };

    static connectToNameSapce(namespace){
        const socket = io("localhost:3000"+namespace);
        WebSocket.sockets.set(namespace,socket);
        return socket;
    };

    static getSocket(){
        if(!WebSocket.sockets.has("/")){
            WebSocket.connect()
        };
        return WebSocket.sockets.get("/");
    };

    static getSocketByNameSpace(namespace){
        console.log(WebSocket.sockets.keys(),WebSocket.sockets.values());
        if(!WebSocket.sockets.has(namespace)){
            WebSocket.connectToNameSapce(namespace);
        };
        return WebSocket.sockets.get(namespace);
    };
}