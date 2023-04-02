import { checkWin } from "../logic/checkWin.js";
import { UserModal } from "../models/user.js";
import { getNewRating } from "../logic/elo.js";
import { nextMove, setUp, setUpLocal } from "../logic/ai.js";
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

        await GameModal.create(game);

        // Handle disconnects
        socket.on("disconnect", async () => {
          socket.leave(roomId);
          activeGames.delete(gameId);
          await GameModal.updateOne({ gameId: gameId }, { gameOver: true, winner: game.playerOne === socket.username ? game.playerTwo : game.playerOne });
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
        playerOne: socket.username,
        type: "singleplayer",
        gameOver: false,
      });
      game = res.length > 0 ? res[0] : null;
      gameId = game !== null ? game.gameId : null;
      if(game)
        setUpLocal(JSON.parse(JSON.stringify(game.board)), 1);
      else
        socket.emit("game-error", { message: "No game to resume" });
        return;
    }

    activeGames.set(gameId, game);
    socket.emit("setup", activeGames.get(gameId));
  }
}

export async function customSetup(data, io, socket, activeGames, customqueue) {
  let gameId = uuid();

  let game = {
    gameId,
    board: JSON.parse(JSON.stringify(board)),
    currColumns: JSON.parse(JSON.stringify(currColumns)),
    gameOver: false,
    winner: null,
  };

  if (customqueue.filter((x) => (x[0].username === socket.username) || (x[0].username === data.username)).length === 0) {

    const roomId = uuid();
    socket.join(roomId);
    customqueue.push([socket, roomId]);

    socket.on("disconnect", () => {
      customqueue = customqueue.filter((x) => x[0].username !== socket.username);
      socket.leave(roomId);
    });

    socket.on("disconnect game", () =>{
      customqueue = customqueue.filter((x) => x[0].username !== socket.username);
      socket.leave(roomId)
    })

    socket.emit("custom waitingForOpponent");
  } else {

    const [playerWaiting, roomId] = customqueue.filter((x) => (x[0].username === data.username) || (x[0].username === socket.username))[0];

    customqueue = customqueue.filter((x) => (x[0].username !== data.username) || (x[0].username !== socket.username));

    socket.join(roomId);

    game.playerOne = playerWaiting.username;
    game.playerTwo = socket.username;
    game.currPlayer = playerWaiting.username;
    game.type = "multiplayer";
    game.roomId = roomId;

    activeGames.set(gameId, game);

    await GameModal.create(game);

    // Handle disconnects
    socket.on("disconnect", async () => {
      socket.leave(roomId);
      activeGames.delete(gameId);
      await GameModal.updateOne({ gameId: gameId }, { gameOver: true, winner: game.playerOne === socket.username ? game.playerTwo : game.playerOne });
      io.of("/api/game").to(roomId).emit("game-error", {
        message: "Opponent disconnected",
      });
    });

    // socket.on("disconnect game", async () => {
    //   socket.leave(roomId)
    //   activeGames.delete(gameId)
    //   await GameModal.updateOne({ gameId: gameId }, { gameOver: true, winner: game.playerOne === socket.username ? game.playerTwo : game.playerOne });
    //   io.of("/api/game").to(roomId).emit("game-error",{
    //     message: "Opponent disconnected"
    //   })
    // })

    activeGames.set(gameId, game);
    io.of("/api/game").to(roomId).emit("custom setup", activeGames.get(gameId));
  }
}


export async function newMove(data, io, socket, activeGames) {
  let player = data.player;
  let roomId = data.roomId;
  let move = data.move;
  let game = activeGames.get(data.gameId);

  if (!game || game.currPlayer !== player) return;

  if(game.winner !== null) return;

  if (socket.username !== player) return;

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

      const res = await GameModal.findOne({ gameId: game.gameId });

      if (!res) {
        await GameModal.create(game);
      }
    }

    activeGames.set(data.gameId, game);
    io.of("/api/game").emit("updatedBoard", activeGames.get(data.gameId));

  } else {
    if (gameStatus.gameOver) {
      game.gameOver = gameStatus.gameOver;
      game.winner = gameStatus.winner;

      if (game.winner !== "draw") {
        await updateRatings(game.winner, game.winner === game.playerOne ? game.playerTwo : game.playerOne);
      }
    }

    await GameModal.updateOne({ gameId: game.gameId }, game);

    activeGames.set(data.gameId, game);
    io.of("/api/game").to(roomId).emit("updatedBoard", activeGames.get(data.gameId));
  }

  // Add timeout for gameover
  const timeout = setTimeout(() => {
    let game = activeGames.get(data.gameId);
    if(game && !game.type !=="singeplayer" && !game.gameOver) {
      game.gameOver = true;
      game.winner = game.currPlayer === game.playerOne ? game.playerTwo : game.playerOne;
      socket.emit("game-error", {message: "Opponent timed out"})
      io.of("/api/game").emit("updatedBoard", activeGames.get(data.gameId));
    }
  }, 10000);

  // Reset timeout if new move is made within 5 seconds
  socket.once("newMove", () => {
    clearTimeout(timeout);
  });

}

export function saveGame(data, socket, activeGames) {

  let game = activeGames.get(data.gameId);
  if (socket.handshake.auth.token === "guest") {
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
    gameOver: false,
    winner: null,
    type: game.type,
  })
    .then((res) => {
      socket.emit("savedGame", { message: JSON.stringify(res)+"Game saved successfully" });
    })
    .catch((err) => {
      socket.emit("savedGame", { message: "Game could not be saved" });
    });
}

export function newMessage(data, socket, activeGames) {
  let roomId = data.roomId;
  let player = data.player;
  let game = activeGames.get(data.gameId);

  if (socket.username !== player) return;
  if (game.mute) return;

  for (let index in InGameMessages) {
    let message = InGameMessages[index];
    console.log(message, data.message);
    if (message === data.message) {
      if (roomId) {
        socket.to(roomId).emit("new message", {
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
  if (socket.username !== player) return;
  game.mute = true;
}

export function unmute(data, socket, activeGames) {
  let player = data.player;
  let game = activeGames.get(data.gameId);
  if (socket.username !== player) return;
  game.mute = false;
}

export async function disconnect(data, socket, activeGames, io){
  let { gameId, roomId } = data;
    if(!activeGames.has(gameId)) return;
    let game = activeGames.get(gameId);
    if(game.playerOne === socket.username || game.playerTwo === socket.username){
      socket.leave(roomId)
      activeGames.delete(gameId)
      await GameModal.updateOne({ gameId: gameId }, { gameOver: true, winner: game.playerOne === socket.username ? game.playerTwo : game.playerOne });
      io.of("/api/game").to(roomId).emit("game-error",{
        message: "Opponent disconnected"
      })
    }  
}