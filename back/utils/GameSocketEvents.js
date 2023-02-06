import { WebSocket } from "./WebSocket";

WebSocket.attachEventListenerToNamespace("/api/game", "connection", (socket) => {
    console.log("A client connected to the game namespace");
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
    socket.on("updatedBoard", (data) => {
        console.log("Received updatedBoard event with data:", data);
    
        // A new move has been made
        let { column, player } = data;
        for (let i = board.length - 1; i >= 0; i--) {
        if (board[i][column] === 0) {
            board[i][column] = player;
            break;
        }
        }
    
        WebSocket.emitEventToNamespace("/game", "newMove", { board });
    });
});