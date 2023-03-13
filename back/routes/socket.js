import auth from "../middlewares/socket.js";
import {setup} from "../logic/setup.js";
import {newMove} from "../logic/ai/newMove.js";
import {saveGame} from "../logic/saveGame.js";

export default function (socket) {
  const activeGames = new Map();
  const queue = new Array();

  socket.of("/api/game").use(auth);

  socket.of("/api/game").on("connection", (socket) => {

    console.log("A client connected to the game namespace");

    // probably shared and should be stored with sockets playing the game
    socket.on("setup", async (data) => setup(data, socket, activeGames, queue));

    socket.on("newMove", async (data) => newMove(data, socket, activeGames));

    socket.on("saveGame", (data) => saveGame(data, socket, activeGames));

  });

  console.log("Socket server listening on port 3000");
}

