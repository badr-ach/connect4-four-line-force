import { checkWin } from "../logic/checkWin.js";

let aiPlays = true;
let maxDepth = 4;
const ROWS = 6;
const COLS = 7;
const OPPONENT_PLAYER = 2;
function setup(AIplays) {
    aiPlays = (AIplays === 1);
    return true;
}

export function nextMove({board}) {

    /*return new Promise(function(resolve, reject) {
        setTimeout(() => {

        }, 100);
    });*/
    let bestMove = minimax(board, maxDepth, -Infinity, Infinity, aiPlays);

    // Convert the best move into an array format
    let col = bestMove.move.col;
    let row = bestMove.move.row;
    let move = [row, col];
    console.log("move", bestMove)
    console.log("best move", board)

    return move;
}
/*
function minimax1(board, depth, alpha, beta, maximizingPlayer) {
    //console.log("board minimax", board[0])
    if (depth === 0 || isTerminalNode(board)) {
        return { move: null, score: evaluate(board) };
    }

    let validMoves = getValidMoves(board);
    let bestMove = null;
    let bestScore = maximizingPlayer ? -Infinity : Infinity;

    for (let i = 0; i < validMoves.length; i++) {
        let move = validMoves[i];
        let newBoard = makeMove(board, move, maximizingPlayer ? 1 : 2);
        let score = minimax(newBoard, depth - 1, alpha, beta, !maximizingPlayer).score;

        if (maximizingPlayer && score > bestScore) {
            bestMove = move;
            bestScore = score;
            alpha = Math.max(alpha, score);
        } else if (!maximizingPlayer && score < bestScore) {
            bestMove = move;
            bestScore = score;
            beta = Math.min(beta, score);
        }

        if (alpha >= beta) {
            break;
        }
    }

    return { move: bestMove, score: bestScore };
}

 */
function isTerminalNode(board) {
    // Check if the board is full
    if (getValidMoves(board).length === 0) {
        return true;
    }

    // Check for a win
    //let win = checkForWin(board);
    let win = checkWin({...board} )
    if (win.winner === true) {
        return true;
    }

    // Otherwise, the game is not over
    return false;
}

function makeMove(board, move, player) {
    let newBoard = [];
    for (let i = 0; i < board.length; i++) {
        newBoard[i] = board[i].slice();
    }

    for (let row = 5; row >= 0; row--) {
        if (newBoard[row][move] === 0) {
            newBoard[row][move] = player;
            break;
        }
    }

    return newBoard;
}


function minimax(board, depth, alpha, beta, maximizingPlayer) {
    // base case: leaf node or maximum depth reached
    if (depth === 0 || isTerminalNode(boardCopy)) {
        return { score: evaluate(boardCopy) };
    }

    let boardCopy = JSON.parse(JSON.stringify(board));
    let bestMove;
    let bestScore;
    if (maximizingPlayer) {
        bestScore = -Infinity;
        const moves = getMoves(boardCopy, AI_PLAYER);
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            boardCopy[move.row][move.col] = move.player;
            const { score } = minimax(boardCopy, depth - 1, alpha, beta, false);
            boardCopy[move.row][move.col] = EMPTY;
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) {
                break;
            }
        }
    } else {
        bestScore = Infinity;
        const moves = getMoves(boardCopy, HUMAN_PLAYER);
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            boardCopy[move.row][move.col] = move.player;
            const { score } = minimax(boardCopy, depth - 1, alpha, beta, true);
            boardCopy[move.row][move.col] = EMPTY;
            if (score < bestScore) {
                bestScore = score;
                bestMove = move;
            }
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) {
                break;
            }

            // check for opponent's potential winning moves and block them
            const opponentMoves = getMoves(boardCopy, AI_PLAYER);
            for (let j = 0; j < opponentMoves.length; j++) {
                const opponentMove = opponentMoves[j];
                boardCopy[opponentMove.row][opponentMove.col] = opponentMove.player;
                const { score } = evaluate(boardCopy);
                boardCopy[opponentMove.row][opponentMove.col] = EMPTY;
                if (score === WINNING_SCORE) {
                    // if opponent has a potential winning move, block it
                    boardCopy[opponentMove.row][opponentMove.col] = HUMAN_PLAYER;
                    const { score } = minimax(boardCopy, depth - 1, alpha, beta, true);
                    boardCopy[opponentMove.row][opponentMove.col] = EMPTY;
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove = opponentMove;
                    }
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
    }

    return { move: bestMove, score: bestScore };
}

function copy_board(board) {
    let copy = [];
    for (let row of board) {
        let row_copy = row.slice();
        copy.push(row_copy);
    }
    return copy;
}
// define constants
const EMPTY = 0;
const AI_PLAYER = 2;
const HUMAN_PLAYER = 1;
const WINNING_SCORE = 1000;
const MAX_DEPTH = 5;

// evaluate the score of the current state
function evaluate(board) {
    let score = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === AI_PLAYER) {
                // count AI's chips in a row
                let count = 1;
                for (let k = 1; k < 4 && j + k < board[i].length && board[i][j + k] === AI_PLAYER; k++) {
                    count++;
                }
                score += Math.pow(10, count);
            } else if (board[i][j] === HUMAN_PLAYER) {
                // count human's chips in a row
                let count = 1;
                for (let k = 1; k < 4 && j + k < board[i].length && board[i][j + k] === HUMAN_PLAYER; k++) {
                    count++;
                }
                score -= Math.pow(10, count);
            }
        }
    }
    return score;
}

// check if the board is full
function isBoardFull(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === EMPTY) {
                return false;
            }
        }
    }
    return true;
}

// get all possible moves for the current player
function getMoves(board, player) {
    const moves = [];
    for (let j = 0; j < board[0].length; j++) {
        if (board[0][j] === EMPTY) {
            for (let i = board.length - 1; i >= 0; i--) {
                if (board[i][j] === EMPTY) {
                    moves.push({ row: i, col: j, player: player });
                    break;
                }
            }
        }
    }
    return moves;
}
function getValidMoves(board) {
    const validMoves = [];
    const columns = board[0].length;

    for (let col = 0; col < columns; col++) {
        // Check if the top row of the column is empty
        if (board[0][col] === 0) {
            // Add the move to the valid moves list
            validMoves.push({ col, player: AI_PLAYER });
        }
    }

    return validMoves;
}




