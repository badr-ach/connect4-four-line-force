import { WebSocket } from "./webSocket.js";

export default function(server){
    //create a socket server
    WebSocket.connect(server);

    WebSocket.attachEventListener("connection", (socket) => {

        console.log("client connected to the socket server");
        
        socket.on('message', message => {
            console.log(`Received message: ${message}`);
            socket.send(`Echo: ${message}`);
    
        });
    
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    WebSocket.attachEventListenerToNamespace("/api/game","connection",(socket,data,message) => {
        console.log("A client connected to the game namespace");
        console.log("this is socket",socket);
        console.log("this is data",data, message);
        
        let board = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        ];
        // Setup a new game here
        socket.emit("newGame", { board });

        // Handle the updatedBoard event
        // socket.on("updatedBoard", (data) => {
        //     console.log("Received updatedBoard event with data:", data);

        //     // A new move has been made
        //     let { column, player } = data;
        //     for (let i = board.length - 1; i >= 0; i--) {
        //     if (board[i][column] === 0) {
        //         board[i][column] = player;
        //         break;
        //     }
        //     }

        //     WebSocket.emitEventToNamespace("/game", "newMove", { board });
        // });
    })

    console.log("Socket server listening on port 3000");
}
