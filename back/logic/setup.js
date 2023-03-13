import { nextMove, setUp, setUpLocal } from "./ai/one.js";
import { v4 as uuid } from "uuid";
import { GameModal } from "../models/game.js";

export async function setup(data, socket, activeGames, queue) {
  let whoPlays = data.AIplays;
  let gameId = uuid();
  let game = {
    gameId,
    board: JSON.parse(JSON.stringify(board)),
    currColumns: JSON.parse(JSON.stringify(currColumns)),
    currPlayer: 1,
    gameOver: false,
    winner: null,
  };

  if (whoPlays == -1) {
    if (socket.username == "guest") {
      socket.emit("setup-error", {
        message: "Guests cannot play against other players",
      });
      return;
    } else {
      if (queue.length === 0) {
        console.log("No waiting room exists. Creating one...");

        waitingRoom.push(socket);
        // Handle disconnects
        socket.on("disconnect", () => {
          console.log("Client disconnected from the game namespace");
          waitingRoom.pop();
        });

        socket.emit("waitingForOpponent");
      } else {
        console.log("A waiting room exists. Joining it...");

        const playerWaiting = waitingRoom.pop();
        const roomId = uuid();

        // Create a room for the two players
        playerWaiting.join(roomId);
        socket.join(roomId);

        console.log("Game started between ${socket.id} and ${roomId}");

        game.playerOne = playerWaiting.username;
        game.playerTwo = socket.username;
        // // Handle setup and moves for the game

        // socket.on("newMove", async (data) =>
        //   newMove(data, socket, activeGames, roomId)
        // );

        // // Handle disconnects
        // socket.on("disconnect", () => {
        //   console.log("Client disconnected from the game namespace");
        //   socket.leave(room);
        //   activeGames.delete(room);
        // });
      }
    }
  } else {

    let aiReady = await setUp(whoPlays).then((res) => {
      return res;
    });

    if (!data.resume) {
        game.playerOne = socket.username
        game.playerTwo = "AI"

        if (whoPlays === 1 && aiReady) {
        let aiMove = await nextMove([]).then((res) => {
          return res;
        });
        
        game.board[aiMove[1]][aiMove[0]] = 2;
        game.currColumns[aiMove[0]]--;
      }
    } else {
      const res = await GameModal.last({
        playerOne: playerOne,
        gameOver: false,
      });
      game = res ? res[0] : {};
      gameId = res ? (res[0] ? res[0].gameId : null) : null;
      setUpLocal(JSON.parse(JSON.stringify(game.board)), 1);
    }
  }

  activeGames.set(gameId, game);
  socket.emit("setup", activeGames.get(gameId));
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
