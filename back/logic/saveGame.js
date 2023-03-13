import { GameModal } from "../models/game.js";

export function saveGame(data, socket, activeGames) {
  let game = activeGames.get(data.gameId);
  if (socket.handshake.auth.id === "guest") {
    socket.emit("savedGame", { message: "Guests cannot save games" });
    return;
  }
  

  GameModal.create({
    gameId: game.gameId,
    board: game.board,
    currColumns: game.currColumns,
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    currPlayer: game.currPlayer,
    gameOver: game.gameOver,
    winner: game.winner,
  })
    .then((res) => {
      socket.emit("savedGame", { message: "Game saved successfully" });
    })
    .catch((err) => {
      socket.emit("savedGame", { message: "Game could not be saved" });
    });
}
