import getAiMove from "../logic/ai.js";
import { v4 as uuid } from "uuid";
import { checkWin } from "../logic/checkWin.js";

import { ObjectId } from "mongodb";

import auth from "../middlewares/socket.js";
import { GameModal } from "../models/game.js";

export default function (socket) {
  const activeGames = new Map();

  socket.of("/api/game").use(auth);

  socket.of("/api/game").on("connection", (socket) => {
    console.log("A client connected to the game namespace");

    // probably shared and should be stored with sockets playing the game
    socket.on("setup", async (data) => {
      let playerOne = data.player;
      let playerTwo = "AI";
      let game = {};
      let gameId;

      if (!data.resume) {
        gameId = uuid();
        game = {
          gameId,
          board: JSON.parse(JSON.stringify(board)),
          currColumns: JSON.parse(JSON.stringify(currColumns)),
          playerOne,
          playerTwo,
          currPlayer: 1,
          gameOver: false,
          winner: null,
        };

        if (data.id == 1) {
          let aiMove = getAiMove({ board: game.board });
          game.board[aiMove[0]][aiMove[1]] = "AI";
          game.currColumns[aiMove[1]]--;
        }
      } else {
        const res = await GameModal.last({
            playerOne : playerOne,
            gameOver: false,
        });
        game = res ? res[0] : {};
        gameId = res ? res[0].gameId : null;
      }

      activeGames.set(gameId, game);
      socket.emit("setup", activeGames.get(gameId));
    });

    socket.on("newMove", (data) => {
      let move = data.move;
      let game = activeGames.get(data.gameId);
      if (
        move[0] < 0 ||
        move[0] > 5 ||
        move[1] < 0 ||
        move[1] > 6

      )
        return;
      if (game.board[move[0]][move[1]] != 0) return;

      console.log(move);

      game.board[move[0]][move[1]] = 1;
      game.currColumns[move[1]]--;

      let gameStatus = checkWin({ ...game, rows: 6, columns: 7 });

      if (!gameStatus.gameOver) {
        let aiMove = getAiMove({ board: game.board });
        game.board[aiMove[0]][aiMove[1]] = 2;
        game.currColumns[aiMove[1]]--;
        gameStatus = checkWin({ ...game, currPlayer: 2, rows: 6, columns: 7 });
      }

      if (gameStatus.gameOver) {
        game.gameOver = gameStatus.gameOver;
        game.winner = gameStatus.winner;
        activeGames.set(data.gameId, game);
      }

      socket.emit("updatedBoard", activeGames.get(data.gameId));
    });

    socket.on("saveGame", (data) => {
      let game = activeGames.get(data.gameId);
      if(socket.handshake.auth.id === "guest") {
        socket.emit("savedGame", {message: "Guests cannot save games"});
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
      }).then((res) => {
      socket.emit("savedGame", {message: "Game saved successfully"});
      }).catch((err) => {
        socket.emit("savedGame", {message: "Game could not be saved"});
      });
    });
  });

  console.log("Socket server listening on port 3000");
}

const board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

const currColumns = [5, 5, 5, 5, 5, 5, 5];
