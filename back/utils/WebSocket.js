import { Server } from "socket.io";

export class WebSocket{
    
    static socket = null;

    static connect(server){
        WebSocket.socket = new Server(server);
    }

    static getSocket(){
        return WebSocket.socket;
    }

    static attachEventListener(event, callback){
        WebSocket.getSocket().on(event, callback);
    }

    static emitEvent(event, data){
        WebSocket.getSocket().emit(event, data);
    }

    static attachEventListenerToNamespace(namespace, event, callback){
        WebSocket.getSocket().of(namespace).on(event, callback);
    }

    static emitEventToNamespace(namespace, event, data){
        WebSocket.getSocket().of(namespace).emit(event, data);
    }
}