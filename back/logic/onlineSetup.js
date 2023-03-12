import { nextMove, setUp, setUpLocal } from "./one.js";
import { v4 as uuid } from "uuid";
import { GameModal } from "../models/game.js";

export async function setup(data, socket, io, room) {
    let whoPlays = data.AIplays;
    let playerOne = data.player;
    let playerTwo = "AI";
    let game = {};
    let gameId;

    let aiReady = await setUp(whoPlays).then((res) => {return res;});

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

        if (whoPlays === 1 && aiReady) {
            let aiMove = await nextMove([]).then((res) => {return res;})
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

    activeGames.set(gameId, game);

    socket.on("disconnect", () => {
        io.in(room).emit("gameAbandoned");
    });
};

const board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

const currColumns = [5, 5, 5, 5, 5, 5, 5];
