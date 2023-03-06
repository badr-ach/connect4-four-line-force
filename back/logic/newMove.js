import {checkWin} from "./checkWin.js";
import {nextMove} from "./one.js";

export async function newMove(data, socket, activeGames) {
    let move = data.move;
    let game = activeGames.get(data.gameId);
    if (move[0] < 0 || move[0] > 5 || move[1] < 0 || move[1] > 6) return;
    if (game.board[move[0]][move[1]] != 0) return;

    game.board[move[0]][move[1]] = 1;
    game.currColumns[move[1]]--;

    let gameStatus = checkWin({ ...game, rows: 6, columns: 7 });



    if (!gameStatus.gameOver) {
        let startTime = performance.now();
        let aiMove = await nextMove([move[1],move[0]]).then((res) => { return res;})
        let endTime = performance.now();
        console.log("ai move time", endTime - startTime);

        game.board[aiMove[1]][aiMove[0]] = 2;
        game.currColumns[aiMove[0]]--;
        gameStatus = checkWin({ ...game, currPlayer: 2, rows: 6, columns: 7 });
    }

    if (gameStatus.gameOver) {
        game.gameOver = gameStatus.gameOver;
        game.winner = gameStatus.winner;
        activeGames.set(data.gameId, game);
    }

    socket.emit("updatedBoard", activeGames.get(data.gameId));
};
