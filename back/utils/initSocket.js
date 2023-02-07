import getAiMove from "../logic/ai.js";
import { WebSocket } from "./webSocket.js";
import { v4 as uuid } from "uuid";

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

  // WebSocket.attachEventListener("connection", (socket) => {

  //     console.log("client connected to the socket server");

  //     socket.on('disconnect', () => {
  //         console.log('Client disconnected');
  //     });
  // });

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

        activeGames.set(gameId, {
          gameId,
          board,
          currColumns,
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

        let { gameOver, winner } = checkWin({...game,rows:6,columns:7});

        if ( !gameOver ) {
            let aiMove = getAiMove({ board });
            board[aiMove[0]][aiMove[1]] = "AI";
            currColumns[aiMove[1]]--;
        }else{
            game.gameOver = gameOver;
            game.winner = winner;
            activeGames.set(data.gameId, game);
        }

        socket.emit("updatedBoard", activeGames.get(data.gameId));
      });

      const checkWin = ({
        board,
        currPlayer,
        rows,
        columns,
      }) => {

        //check horizontal
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns - 3; j++) {
            if (
              board[i][j] !== 0 &&
              board[i][j] === board[i][j + 1] &&
              board[i][j] === board[i][j + 2] &&
              board[i][j] === board[i][j + 3]
            ) {
                return {
                    gameOver : true,
                    winner : currPlayer
                }
              
            }
          }
        }

        //check vertical
        for (let i = 0; i < rows - 3; i++) {
          for (let j = 0; j < columns; j++) {
            if (
              board[i][j] !== 0 &&
              board[i][j] === board[i + 1][j] &&
              board[i][j] === board[i + 2][j] &&
              board[i][j] === board[i + 3][j]
            ) {
                return {
              gameOver : true,
              winner : currPlayer
                }
            }
          }
        }

        //check diagonal
        for (let i = 0; i < rows - 3; i++) {
          for (let j = 0; j < columns - 3; j++) {
            if (
              board[i][j] !== 0 &&
              board[i][j] === board[i + 1][j + 1] &&
              board[i][j] === board[i + 2][j + 2] &&
              board[i][j] === board[i + 3][j + 3]
            ) {
                return {
              gameOver : true,
              winner : currPlayer
                }
            }
          }
        }

        //check diagonal
        for (let i = 0; i < rows - 3; i++) {
          for (let j = 3; j < columns; j++) {
            if (
              board[i][j] !== 0 &&
              board[i][j] === board[i + 1][j - 1] &&
              board[i][j] === board[i + 2][j - 2] &&
              board[i][j] === board[i + 3][j - 3]
            ) {
                return {
              gameOver : true,
              winner : currPlayer
                }
            }
          }
        }

        //check tie
        let tie = true;
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            if (board[i][j] === 0) {
              tie = false;
            }
          }
        }

        if (tie) {
          return {
            gameOver:  true,
            winner : "Tie"
              }
        }
 
        return {
            gameOver : false,
            winner : null
        };
      };
    }
  );

  console.log("Socket server listening on port 3000");
}
