export class WebSocket{
    constructor(){
        this._socket
    }
    
    static socket = null;

    static connect(server){
        WebSocket.socket = io();
        WebSocket.socket.on('connect', () => {
            console.log('Connected to server');
        });
    }

    static getSocket(){
        if(WebSocket.socket === null){
            WebSocket.connect()
        }
        return WebSocket.socket;
    }
}