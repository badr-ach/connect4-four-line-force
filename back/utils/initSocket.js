import getAiMove from "../logic/ai.js";
import { WebSocket } from "./webSocket.js";
import { v4 as uuid } from "uuid";
import { checkWin } from "../logic/checkWin.js";

const board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

const currColumns = [5, 5, 5, 5, 5, 5, 5];

const activeGames = new Map();

export default function (server) {
  //create a socket server
  WebSocket.connect(server);

  WebSocket.attachEventListener("connection", (socket) => {
    console.log("client connected to the socket server");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  WebSocket.attachEventListenerToNamespace(
    "/api/game",
    "connection",
    (socket) => {
      console.log("A client connected to the game namespace");

      // probably shared and should be stored with sockets playing the game
      socket.on("newGame", (data) => {
        let playerOne = data.player;
        let playerTwo = "AI";

        let gameId = uuid();
        console.log(gameId);
        activeGames.set(gameId, {
          gameId,
          board: JSON.parse(JSON.stringify(board)),
          currColumns: JSON.parse(JSON.stringify(currColumns)),
          playerOne,
          playerTwo,
          currPlayer: playerOne,
          gameOver: false,
          winner: null,
        });

        socket.emit("newGame", activeGames.get(gameId));
      });

      socket.on("newMove", (data) => {
        let move = data.move;
        let player = data.player;


        let game = activeGames.get(data.gameId);
        game.board[move[0]][move[1]] = player;
        game.currColumns[move[1]]--;

        let gameStatus = checkWin({ ...game, rows: 6, columns: 7 });

        if (!gameStatus.gameOver) {
          let aiMove = getAiMove({ board: game.board });
          game.board[aiMove[0]][aiMove[1]] = "AI";
          game.currColumns[aiMove[1]]--;
        }

        gameStatus = checkWin({ ...game, currPlayer:"AI", rows: 6, columns: 7 });

        if (gameStatus.gameOver) {
          game.gameOver = gameStatus.gameOver;
          game.winner = gameStatus.winner;
          activeGames.set(data.gameId, game);
        }

        socket.emit("updatedBoard", activeGames.get(data.gameId));
      });
    }
  );

  console.log("Socket server listening on port 3000");
}
