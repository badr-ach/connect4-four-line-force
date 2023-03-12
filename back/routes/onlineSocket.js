import auth from "../middlewares/socket.js";
import { GameModal } from "../models/game.js";
import {setup} from "../logic/setup.js";
import {newMove} from "../logic/newMove.js";
import {saveGame} from "../logic/saveGame.js";

export default function (socket) {


    const activeGames = new Map();

    socket.of("/api/onlineGame").use(auth);

    let waitingRoom = null;

    socket.of("/api/onlineGame").on("connection", (socket) => {

        console.log("A client connected to the game namespace");

        if (waitingRoom === null) {
            console.log('No waiting room exists. Creating one...');
            waitingRoom = socket.id;
            socket.emit('waitingForOpponent');
        } else {
            console.log('A waiting room exists. Joining it...');
            const roomId = waitingRoom;
            waitingRoom = null;

            // Create a room for the two players
            socket.join(roomId);
            socket.to(roomId).emit('gameStart');

            console.log("Game started between ${socket.id} and ${roomId}");

            // Handle setup and moves for the game
            socket.on("setup", async (data) => setup(data, socket, activeGames, roomId));

            socket.on("newMove", async (data) => newMove(data, socket, activeGames, roomId));

            // Handle disconnects
            socket.on("disconnect", () => {
                console.log("Client disconnected from the game namespace");
                socket.leave(room);
                activeGames.delete(room);
            });
        }
    });
            console.log("Socket server listening on port 3000");
}

