import { checkWin } from "../logic/checkWin.js";

let aiPlays = false;
let maxDepth = 4;

function setup(AIplays) {
    aiPlays = (AIplays === 1);
    return true;
}

export function nextMove({board}) {
    setup(2);
    /*return new Promise(function(resolve, reject) {
        setTimeout(() => {

        }, 100);
    });*/
    let bestMove = minimax(board, maxDepth, -Infinity, Infinity, aiPlays);

    // Convert the best move into an array format
    let col = bestMove.move % 7;
    let row = Math.floor(bestMove.move / 7);
    let move = [row, col];

    return move;
}

function minimax(board, depth, alpha, beta, maximizingPlayer) {
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

function getValidMoves(board) {
    let moves = [];
    for (let col = 0; col < 7; col++) {
        if (board[0][col] === 0) {
            moves.push(col);
        }
    }
    return moves;
}

function evaluate(board) {
    let score = 0;

    // Check for vertical wins
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 3; row++) {
            let window = [board[row][col], board[row+1][col], board[row+2][col], board[row+3][col]];
            score += evaluateWindow(window);
        }
    }

    // Check for horizontal wins
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            let window = [board[row][col], board[row][col+1], board[row][col+2], board[row][col+3]];
            score += evaluateWindow(window);
        }
    }

    // Check for diagonal wins (positive slope)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            let window = [board[row][col], board[row+1][col+1], board[row+2][col+2], board[row+3][col+3]];
            score += evaluateWindow(window);
        }
    }

    // Check for diagonal wins (negative slope)
    for (let row = 0; row < 3; row++) {
        for (let col = 3; col < 7; col++) {
            let window = [board[row][col], board[row+1][col-1], board[row+2][col-2], board[row+3][col-3]];
            score += evaluateWindow(window);
        }
    }

    return score;
}
function evaluateWindow(window) {
    let score = 0;

    // Count the number of pieces belonging to the AI player and the opponent
    let aiCount = window.filter(p => p === 1).length;
    let oppCount = window.filter(p => p === 2).length;

    // Add to the score based on the number of pieces in the window
    if (aiCount === 4) {
        score += 100000;
    } else if (aiCount === 3 && oppCount === 0) {
        score += 100;
    } else if (aiCount === 2 && oppCount === 0) {
        score += 10;
    } else if (aiCount === 1 && oppCount === 0) {
        score += 1;
    } else if (oppCount === 4) {
        score -= 100000;
    } else if (oppCount === 3 && aiCount === 0) {
        score -= 100;
    } else if (oppCount === 2 && aiCount === 0) {
        score -= 10;
    } else if (oppCount === 1 && aiCount === 0) {
        score -= 1;
    }

    return score;
}



