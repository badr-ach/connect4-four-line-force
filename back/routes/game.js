import auth from "../middlewares/socket.js";
import { setup, newMove, saveGame } from "../controllers/game.js";

export const init_game_socket = (io) => {

    io.of("/api/game").use(auth);

    io.of("/api/game").on("connection", (socket) => {
  
      const activeGames = new Map();
    
      const queue = new Array();
  
      // probably shared and should be stored with sockets playing the game
      socket.on("setup", async (data) => setup(data, io, socket, activeGames, queue));
  
      socket.on("newMove", async (data) => newMove(data, io, socket, activeGames));
  
      socket.on("saveGame", (data) => saveGame(data, socket, activeGames));
  
    });

}