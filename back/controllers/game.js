import { checkWin } from "../logic/checkWin.js";
import { nextMove } from "../logic/ai.js";
import { UserModal } from "../models/user.js";
import { getNewRating } from "../logic/elo.js";
import { nextMove, setUp, setUpLocal } from "./ai.js";
import { v4 as uuid } from "uuid";
import { GameModal } from "../models/game.js";
import { InGameMessages } from "../utils/constants/messages.js";

const board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

const currColumns = [5, 5, 5, 5, 5, 5, 5];


async function updateRatings(winner, loser) {
  let winnerUser = await UserModal.findOne({ username: winner });
  let loserUser = await UserModal.findOne({ username: loser });

  let newWinnerRating = getNewRating(winnerUser.rating, loserUser.rating, 1);
  let newLoserRating = getNewRating(loserUser.rating, winnerUser.rating, 0);

  await UserModal.updateOne({ username: winnerUser.username }, { rating: newWinnerRating });
  await UserModal.updateOne({ username: loserUser.username }, { rating: newLoserRating });
}

export async function setup(data, io, socket, activeGames, queue) {

  let whoPlays = data.AIplays;

  let gameId = uuid();

  let game = {
    gameId,
    board: JSON.parse(JSON.stringify(board)),
    currColumns: JSON.parse(JSON.stringify(currColumns)),
    gameOver: false,
    winner: null,
  };

  if (whoPlays == -1) {
    if (socket.username == "guest") {
      socket.emit("game-error", {
        message: "Guests cannot play against other players",
      });
      return;
    } else {
      if (queue.length === 0) {
        console.log("No waiting room exists. Creating one...");

        const roomId = uuid();
        socket.join(roomId);
        queue.push([socket, roomId]);

        // Handle disconnects
        socket.on("disconnect", () => {
          queue.pop();
          socket.leave(roomId);
        });

        socket.emit("waitingForOpponent");
      } else {
        const [playerWaiting, roomId] = queue.pop();
        socket.join(roomId);

        game.playerOne = playerWaiting.username;
        game.playerTwo = socket.username;
        game.currPlayer = playerWaiting.username;
        game.type = "multiplayer";
        game.roomId = roomId;

        activeGames.set(gameId, game);
        io.of("/api/game").to(roomId).emit("setup", activeGames.get(gameId));

        // Handle disconnects
        socket.on("disconnect", () => {
          socket.leave(roomId);
          activeGames.delete(gameId);
          io.of("/api/game").to(roomId).emit("game-error", {
            message: "Opponent disconnected",
          });
        });
      }
    }
  } else {
    let aiReady = await setUp(whoPlays).then((res) => {
      return res;
    });

    if (!data.resume) {
      game.playerOne = socket.username;
      game.playerTwo = "AI";
      game.type = "singleplayer";
      game.currPlayer = socket.username;

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
        type: "singleplayer",
        gameOver: false,
      });
      game = res ? res[0] : {};
      gameId = res ? (res[0] ? res[0].gameId : null) : null;
      setUpLocal(JSON.parse(JSON.stringify(game.board)), 1);
    }

    activeGames.set(gameId, game);
    socket.emit("setup", activeGames.get(gameId));
  }
}

export async function newMove(data, io, socket, activeGames) {
  let player = data.player;
  let roomId = data.roomId;
  let move = data.move;
  let game = activeGames.get(data.gameId);

  if(!game || game.currPlayer !== player) return;

  if(socket.username !== player) return;

  if (move[0] < 0 || move[0] > 5 || move[1] < 0 || move[1] > 6) return;

  if (game.board[move[0]][move[1]] != 0) return;

  game.board[move[0]][move[1]] = player === game.playerOne ? 1 : 2;

  game.currColumns[move[1]]--;

  let gameStatus = checkWin({ ...game, rows: 6, columns: 7 });

  game.currPlayer = player === game.playerOne ? game.playerTwo : game.playerOne;


  if (!roomId) {
    if (!gameStatus.gameOver && game.type === "singleplayer") {
      let aiMove = await nextMove([move[1], move[0]]).then((res) => {
        return res;
      });
      game.board[aiMove[1]][aiMove[0]] = 2;
      game.currColumns[aiMove[0]]--;
      gameStatus = checkWin({ ...game, rows: 6, columns: 7 });
      game.currPlayer = player;
    }

    if (gameStatus.gameOver) {
      game.gameOver = gameStatus.gameOver;
      game.winner = gameStatus.winner;
    }
    
    activeGames.set(data.gameId, game);
    io.of("/api/game").emit("updatedBoard", activeGames.get(data.gameId));
  }else{
    if (gameStatus.gameOver) {
        game.gameOver = gameStatus.gameOver;
        game.winner = gameStatus.winner;

        if(game.winner !== "draw"){
          await updateRatings(game.winner, game.winner === game.playerOne ? game.playerTwo : game.playerOne);
        }
    }
    
    activeGames.set(data.gameId, game);
    io.of("/api/game").to(roomId).emit("updatedBoard", activeGames.get(data.gameId));
  }
}

export function saveGame(data, socket, activeGames) {
  
    let game = activeGames.get(data.gameId);
    if (socket.handshake.auth.id === "guest") {
      socket.emit("savedGame", { message: "Guests cannot save games" });
      return;
    }
  
    if(game.playerTwo !== "AI"){
      socket.emit("savedGame", { message: "Only singleplayer games can be saved" });
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

export function newMessage(data, socket, activeGames) {
  let roomId = data.roomId;
  let player = data.player;
  let game = activeGames.get(data.gameId);

  if(socket.username !== player) return;
  if(game.mute) return;

  for(let message in InGameMessages){
    if(message === data.message){
      if (roomId) {
        socket.to(roomId).emit("newMessage", {
          message,
          player,
        });
        return;
      }
    }
  }
}

export function mute(data, socket, activeGames) {
  let player = data.player;
  let game = activeGames.get(data.gameId);
  if(socket.username !== player) return;
  game.mute = true;
}

export function unmute(data, socket, activeGames) {
  let player = data.player;
  let game = activeGames.get(data.gameId);
  if(socket.username !== player) return;
  game.mute = false;
}