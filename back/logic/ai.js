import { checkWin } from "../logic/checkWin.js";

// define constants
const EMPTY = 0;
const AI_PLAYER = 2;
const HUMAN_PLAYER = 1;
const WINNING_SCORE = 1000;
const MAX_DEPTH = 5;

let aiPlays = true;
let maxDepth = 4;
const ROWS = 6;
const COLS = 7;
const OPPONENT_PLAYER = 2;

export function nextMove({board}) {


    return new Promise(function (resolve, reject) {
        setTimeout(() => {
                let start = performance.now();
                let bestMove = monteCarlo(board, 2);
                let end = performance.now();
                console.log("time taken for move :", end - start);
                console.log("bessssssssssssssssssst", bestMove);

                // Convert the best move into an array format

                resolve(bestMove);
                reject("error : Time is out");

        }, 100);
    });
}

function convertBoard(board) {
    var newBoard = [];
    for (var i = 0; i < 6; i++) {
        var row = [];
        for (var j = 0; j < 7; j++) {
            if (board[i][j] != 0) {
                row.push(j);
            }
        }
        newBoard.push(row);
    }
    if(newBoard.length == 0) return "empty";
    return newBoard.reduce((a, b) => a.concat(b), []).join("");
}

function getRow(board, col) {
    for (var i = 5; i >= 0; i--) {
        if (board[i][col] == 0) {
            return i;
        }
    }
    return -1;
}

/*
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
    });
    let bestMove = minimax(board, maxDepth, -Infinity, Infinity, aiPlays);

    // Convert the best move into an array format
    let col = bestMove.move.col;
    let row = bestMove.move.row;
    let move = [row, col];
    console.log("move", bestMove)
    console.log("best move", board)

    return move;
}*/

// optimal moves for the 3 first moves
let optimnal =[
    ["empty",3],
    ["6",4],
    ["0",3],
    ["4",3],
    ["5",3],
    ["3",3],
    ["1",3],
    ["2",2],
    ["64",3],
    ["60",4],
    ["66",2],
    ["63",3],
    ["02",3],
    ["62",3],
    ["61",3],
    ["65",4],
    ["04",3],
    ["42",5],
    ["53",2],
    ["55",3],
    ["03",3],
    ["33",3],
    ["40",3],
    ["34",3],
    ["45",1],
    ["20",2],
    ["16",5],
    ["13",2],
    ["23",2],
    ["606",4],
    ["605",4],
    ["00",3],
    ["52",3],
    ["01",3],
    ["06",3],
    ["56",1],
    ["54",3],
    ["50",3],
    ["46",5],
    ["05",3],
    ["36",3],
    ["35",2],
    ["24",3],
    ["44",3],
    ["41",3],
    ["43",5],
    ["11",3],
    ["30",3],
    ["14",3],
    ["51",3],
    ["22",4],
    ["21",4],
    ["10",3],
    ["31",3],
    ["15",3],
    ["25",3],
    ["26",3],
    ["32",5],
    ["12",3],
    ["646",5],
    ["641",3],
    ["642",3],
    ["645",3],
    ["640",3],
    ["643",3],
    ["644",3],
    ["601",4],
    ["602",4],
    ["603",4],
    ["600",4],
    ["604",4],
    ["632",2],
    ["665",3],
    ["633",3],
    ["662",2],
    ["631",2],
    ["660",2],
    ["636",5],
    ["663",3],
    ["630",3],
    ["664",4],
    ["634",3],
    ["666",4],
    ["661",3],
    ["635",5],
    ["025",3],
    ["023",3],
    ["020",3],
    ["622",3],
    ["026",3],
    ["626",4],
    ["620",3],
    ["024",3],
    ["021",3],
    ["530",2],
    ["625",3],
    ["615",3],
    ["612",4],
    ["041",3],
    ["022",3],
    ["552",4],
    ["613",2],
    ["042",3],
    ["655",4],
    ["652",4],
    ["611",5],
    ["421",3],
    ["653",4],
    ["534",3],
    ["656",5],
    ["555",3],
    ["621",4],
    ["426",4],
    ["532",2],
    ["553",3],
    ["624",4],
    ["554",2],
    ["422",3],
    ["420",5],
    ["423",3],
    ["614",4],
    ["623",2],
    ["650",4],
    ["043",3],
    ["045",3],
    ["550",3],
    ["425",5],
    ["343",2],
    ["342",3],
    ["402",3],
    ["330",3],
    ["344",3],
    ["400",3],
    ["456",3],
    ["336",2],
    ["403",3],
    ["404",3],
    ["334",4],
    ["335",3],
    ["165",3],
    ["450",1],
    ["345",3],
    ["451",2],
    ["136",2],
    ["135",2],
    ["230",2],
    ["132",2],
    ["161",3],
    ["536",5],
    ["561",3],
    ["504",3],
    ["364",1],
    ["006",3],
    ["520",3],
    ["616",2],
    ["505",3],
    ["412",3],
    ["416",4],
    ["564",3],
    ["112",3],
    ["244",3],
    ["066",3],
    ["510",3],
    ["242",1],
    ["500",3],
    ["305",3],
    ["113",3],
    ["044",3],
    ["003",3],
    ["535",4],
    ["240",3],
    ["654",3],
    ["030",3],
    ["365",3],
    ["411",4],
    ["144",3],
    ["040",3],
    ["035",3],
    ["323",2],
    ["031",3],
    ["143",3],
    ["354",3],
    ["221",3],
    ["141",3],
    ["224",2],
    ["360",3],
    ["410",3],
    ["610",3],
    ["151",3],
    ["054",3],
    ["213",2],
    ["514",5],
    ["445",2],
    ["140",3],
    ["120",3],
    ["014",3],
    ["222",2],
    ["513",3],
    ["523",3],
    ["100",3],
    ["036",3],
    ["562",4],
    ["413",4],
    ["204",2],
    ["225",3],
    ["056",3],
    ["146",3],
    ["362",3],
    ["114",3],
    ["046",3],
    ["012",3],
    ["325",3],
    ["211",2],
    ["150",3],
    ["214",3],
    ["201",2],
    ["556",3],
    ["202",2],
    ["351",1],
    ["424",3],
    ["102",3],
    ["062",3],
    ["103",3],
    ["501",3],
    ["340",3],
    ["460",5],
    ["306",3],
    ["341",3],
    ["446",4],
    ["455",4],
    ["405",3],
    ["533",2],
    ["332",3],
    ["440",3],
    ["106",3],
    ["155",3],
    ["465",3],
    ["551",4],
    ["254",3],
    ["333",3],
    ["123",2],
    ["442",2],
    ["152",3],
    ["346",3],
    ["200",2],
    ["033",3],
    ["406",3],
    ["331",3],
    ["154",2],
    ["130",2],
    ["034",3],
    ["032",3],
    ["164",3],
    ["203",2],
    ["531",2],
    ["453",3],
    ["133",2],
    ["131",3],
    ["401",3],
    ["452",3],
    ["264",2],
    ["235",2],
    ["163",2],
    ["134",3],
    ["205",2],
    ["565",4],
    ["454",3],
    ["234",3],
    ["162",3],
    ["540",3],
    ["160",5],
    ["560",1],
    ["361",2],
    ["166",5],
    ["206",2],
    ["233",2],
    ["315",3],
    ["121",3],
    ["231",2],
    ["232",1],
    ["105",3],
    ["434",3],
    ["322",1],
    ["515",3],
    ["256",4],
    ["260",3],
    ["316",2],
    ["415",5],
    ["503",3],
    ["001",3],
    ["002",3],
    ["010",3],
    ["355",4],
    ["461",3],
    ["060",3],
    ["245",3],
    ["542",3],
    ["061",3],
    ["000",3],
    ["441",3],
    ["241",3],
    ["005",3],
    ["525",4],
    ["443",4],
    ["363",2],
    ["366",2],
    ["065",3],
    ["301",3],
    ["352",1],
    ["015",3],
    ["546",3],
    ["526",3],
    ["050",3],
    ["522",4],
    ["466",3],
    ["016",3],
    ["544",3],
    ["566",5],
    ["013",3],
    ["433",2],
    ["004",3],
    ["563",3],
    ["462",2],
    ["052",3],
    ["246",3],
    ["506",3],
    ["053",3],
    ["435",3],
    ["055",3],
    ["051",3],
    ["430",5],
    ["300",3],
    ["011",3],
    ["101",3],
    ["223",3],
    ["116",2],
    ["543",3],
    ["524",5],
    ["541",3],
    ["521",5],
    ["350",2],
    ["432",3],
    ["111",3],
    ["220",4],
    ["444",3],
    ["353",2],
    ["104",3],
    ["310",3],
    ["110",3],
    ["436",3],
    ["243",3],
    ["431",3],
    ["463",1],
    ["356",4],
    ["512",3],
    ["226",2],
    ["210",4],
    ["314",4],
    ["122",1],
    ["212",3],
    ["252",1],
    ["250",3],
    ["511",3],
    ["326",2],
    ["115",3],
    ["263",3],
    ["216",4],
    ["303",3],
    ["545",4],
    ["253",1],
    ["302",3],
    ["321",2],
    ["261",3],
    ["142",3],
    ["215",3],
    ["126",4],
    ["153",1],
    ["320",5],
    ["324",3],
    ["304",3],
    ["063",3],
    ["312",2],
    ["266",3],
    ["251",3],
    ["262",2],
    ["313",2],
    ["255",3],
    ["125",5],
    ["265",4],
    ["516",3],
    ["145",3],
    ["124",3],
    ["311",3],
    ["414",3],
    ["651",4],
    ["236",2],
    ["464",3],
    ["064",3],
    ["502",3],
    ["156",4],
]




/*
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
    });
    let bestMove = minimax(board, maxDepth, -Infinity, Infinity, aiPlays);

    // Convert the best move into an array format
    let col = bestMove.move.col;
    let row = bestMove.move.row;
    let move = [row, col];
    console.log("move", bestMove)
    console.log("best move", board)

    return move;
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

function minimax(board, depth, alpha, beta, maximizingPlayer) {
    // base case: leaf node or maximum depth reached
    if (depth === 0 || isTerminalNode(board)) {
        return { score: evaluate(board) };
    }

    let bestMove;
    let bestScore;
    if (maximizingPlayer) {
        bestScore = -Infinity;
        const moves = getMoves(board, AI_PLAYER);
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const boardCopy = makeMove(board, move, AI_PLAYER);
            const { score } = minimax(boardCopy, depth - 1, alpha, beta, false);
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
        const moves = getMoves(board, HUMAN_PLAYER);
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const boardCopy = makeMove(board, move, HUMAN_PLAYER);
            let { score } = evaluate(boardCopy);
            if (score === WINNING_SCORE) {
                // if human player has a potential winning move, block it
                boardCopy[move.row][move.col] = AI_PLAYER;
                score = -WINNING_SCORE;
                return { move, score };
            }
            const { score: newScore } = minimax(boardCopy, depth - 1, alpha, beta, true);
            if (newScore < bestScore) {
                bestScore = newScore;
                bestMove = move;
            }
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) {
                break;
            }
        }
    }

    return { move: bestMove, score: bestScore };
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
                // check for opponent's consecutive pieces
                count = 1;
                for (let k = 1; k < 4 && j + k < board[i].length && board[i][j + k] === OPPONENT_PLAYER; k++) {
                    count++;
                }
                if (count === 3) {
                    score -= 1000; // add penalty for opponent having three consecutive pieces
                }
            }
        }
    }
    return score;
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

 */
///////////////////////////////////////////////////////////////////////////////////////////
// This function runs the Monte Carlo simulation and returns the best move
// Define the Monte Carlo function
function monteCarlo(board, player) {
    const SIMULATION_COUNT = 1000; // Number of simulations to run
    const scores = new Array(7).fill(0); // Initialize scores for each column to 0

    // Loop through each column
    for (let column = 0; column < 7; column++) {
        // If column is already full, skip it
        if (board[0][column] !== 0) {
            continue;
        }

        // Simulate games for this column
        for (let i = 0; i < SIMULATION_COUNT; i++) {
            const simulationBoard = copyBoard(board); // Create copy of board to use for simulation
            const simulationBoard1 = makeMove(simulationBoard, column, player); // Make a move for the current player

            // Randomly simulate the rest of the game
            let winner = simulateGame(simulationBoard1, 3 - player); // Opponent is always the other player

            // Update scores for this column
            if (winner === player) {
                // If the current player wins, add a point to this column's score
                scores[column]++;
            } else if (winner === 0) {
                // If it's a tie, add half a point to this column's score
                scores[column] += 0.5;
            }
        }
    }

    // Find the column with the highest score
    let bestColumn = 0;
    let bestScore = -1;
    for (let column = 0; column < 7; column++) {
        if (scores[column] > bestScore) {
            bestColumn = column;
            bestScore = scores[column];
        }
    }

    // Return the row and column of the best move
    return [getAvailableRow(board, bestColumn), bestColumn];
}

// Makes a move for the specified player in the specified column
function makeMove(board, column, player) {
    const row = getAvailableRow(board, column);
    board[row][column] = player;
    return board;
}

// Returns the row of the first available slot in the specified column
function getAvailableRow(board, column) {
    for (let row = 5; row >= 0; row--) {
        if (board[row][column] === 0) {
            return row;
        }
    }
    return -1; // Column is full
}

// Randomly simulates the rest of the game and returns the winner (1, 2, or 0 for tie)
function simulateGame(board, currentPlayer) {
    while (true) {
        const availableColumns = getAvailableColumns(board);
        if (availableColumns.length === 0) {
            // Game is a tie
            return 0;
        }
        const randomColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];
        board = makeMove(board, randomColumn, currentPlayer);
        const winner = checkWin1(board);
        if (winner !== 0) {
            // Game is over
            return winner;
        }
        currentPlayer = 3 - currentPlayer; // Switch to other player
    }
}

// Returns an array of columns that have at least one available slot
function getAvailableColumns(board) {
    const columns = [];
    for (let column = 0; column < 7; column++) {
        if (board[0][column] === 0) {
            columns.push(column);
        }
    }
    return columns;
}

// Checks if the specified player has won the game
function checkWin1(board) {
// Check for horizontal wins
    for (let row = 0; row < 6; row++) {
        for (let column = 0; column < 4; column++) {
            if (board[row][column] !== 0 &&
                board[row][column] === board[row][column + 1] &&
                board[row][column] === board[row][column + 2] &&
                board[row][column] === board[row][column + 3]) {
                return board[row][column];
            }
        }
    }

    // Check for vertical wins
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 7; column++) {
            if (board[row][column] !== 0 &&
                board[row][column] === board[row + 1][column] &&
                board[row][column] === board[row + 2][column] &&
                board[row][column] === board[row + 3][column]) {
                return board[row][column];
            }
        }
    }

    // Check for diagonal wins
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 4; column++) {
            if (board[row][column] !== 0 &&
                board[row][column] === board[row + 1][column + 1] &&
                board[row][column] === board[row + 2][column + 2] &&
                board[row][column] === board[row + 3][column + 3]) {
                return board[row][column];
            }
        }
    }
    for (let row = 0; row < 3; row++) {
        for (let column = 3; column < 7; column++) {
            if (board[row][column] !== 0 &&
                board[row][column] === board[row + 1][column - 1] &&
                board[row][column] === board[row + 2][column - 2] &&
                board[row][column] === board[row + 3][column - 3]) {
                return board[row][column];
            }
        }
    }

    // No winner
    return 0;
}
function copyBoard(board) {
    const newBoard = [];
    for (let row = 0; row < 6; row++) {
        newBoard.push(board[row].slice());
    }
    return newBoard;
}
