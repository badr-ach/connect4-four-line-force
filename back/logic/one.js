let localboard;
let player;
let [firstrow,firstcol] = [null,null];


export function setUpLocal(board,pl){
    localboard = board;
    player = pl;
}


export function setUp(starter){
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            reject("error : Time is out");
        }, 1000);
        localboard = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];

        if(starter === 1){
            player = 1;
            [firstrow,firstcol] = monteCarlo(localboard, player);
        }else{
            player = 2;
        }
        resolve(true);
    });
}

export function nextMove(lastMove) {
    return new Promise(function (resolve, reject) {
            if(lastMove.length === 0){
                //i play first
                localboard = makeMove(localboard, firstcol, player);
                resolve([firstcol,firstrow]);
                return;
            }

            //i play second
            
            //what he played
            let [col,row] = lastMove;
            localboard = makeMove(localboard, col, 3 - player);

            // what i play
            let [myrow,mycol] = monteCarlo(localboard, player);
            localboard = makeMove(localboard, mycol, player);
            resolve([mycol,myrow]);
    });
}


// // This function runs the Monte Carlo simulation and returns the best move///////////////
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

    let row = getAvailableRow(board, bestColumn);
    if(row === -1){
        for(let i = 0; i < 7; i++){
            if(getAvailableRow(board, i) !== -1){
                bestColumn = i;
                break;
            }
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
