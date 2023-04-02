import auth from "../middlewares/socket.js";
import { setup, newMove, saveGame, newMessage, mute, unmute, customSetup, disconnect } from "../controllers/game.js";

export const init_game_socket = (io) => {

    let activeGames = new Map();

    let queue = new Array();

    let challengequeue = new Array();

    io.of("/api/game").use(auth);

    io.of("/api/game").on("connection", (socket) => {
  
      // probably shared and should be stored with sockets playing the game
      socket.on("setup", async (data) => setup(data, io, socket, activeGames, queue));

      socket.on("challenge", async (data) => customSetup(data, io, socket, activeGames, challengequeue));

      socket.on("challenge declined", async (data) => { challengequeue = challengequeue.filter((x) => x[0].username !== data.username) });
  
      socket.on("newMove", async (data) => newMove(data, io, socket, activeGames));
  
      socket.on("saveGame", async (data) => saveGame(data, socket, activeGames));
  
      socket.on("new message", (data) => newMessage(data, socket, activeGames));

      socket.on("mute", (data) => mute(data, socket, activeGames));

      socket.on("unmute", (data) => unmute(data, socket, activeGames));

      socket.on("disconnect game", async (data) => disconnect(data, socket, activeGames, io))
        
    });

}