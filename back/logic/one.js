let board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
]

let player;
let [firstrow,firstcol] = [null,null];

export function setup(starter){
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            reject("error : Time is out");
        }, 1000);
        if(starter === 1){
            player = 1;
            [firstrow,firstcol] = monteCarlo(board, player);
        }else{
            player = 2;
        }
        resolve(true);
    });
}

export function nextMove(lastMove) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            reject("error : Time is out");
        }, 100);

        if(lastMove.length === 0){
            //i play first
            console.log("==================================");
            console.log("col: "+firstcol+" row: "+firstrow);
            console.log("player: "+player);
            console.log("board: "+board);
            console.log("==================================");
            board = makeMove(board, firstcol, player);
            resolve([firstcol,firstrow]);
            return;
        }

        //i play second
        
        //what he played
        let [col,row] = lastMove;
        console.log("==================================");
        console.log("col: "+col+" row: "+row);
        console.log("player: "+player);
        console.log("board: "+board);
        console.log("==================================");
        board = makeMove(board, col, 3 - player);

        // what i play
        let [myrow,mycol] = monteCarlo(board, player);
        board = makeMove(board, mycol, player);
        resolve([mycol,myrow]);
    });
}


function monteCarlo(board, player) {
    const SIMULATION_COUNT = 1300; 
    const scores = new Array(7).fill(0); 

    // Loop through each column
    for (let column = 0; column < 7; column++) {
        if (board[0][column] !== 0) {
            continue;
        }

        for (let i = 0; i < SIMULATION_COUNT; i++) {
            const simulationBoard = copyBoard(board); 
            const simulationBoard1 = makeMove(simulationBoard, column, player); 

            let winner = simulateGame(simulationBoard1, 3 - player);
            if (winner === player) {
                scores[column]++;
            } else if (winner === 0) {
                scores[column] += 0.5;
            }
        }
    }

    let bestColumn = 0;
    let bestScore = -1;
    for (let column = 0; column < 7; column++) {
        if (scores[column] > bestScore) {
            bestColumn = column;
            bestScore = scores[column];
        }
    }
    return [getAvailableRow(board, bestColumn), bestColumn];
}

function makeMove(board, column, player) {
    const row = getAvailableRow(board, column);
    board[row][column] = player;
    return board;
}

function getAvailableRow(board, column) {
    for (let row = 5; row >= 0; row--) {
        if (board[row][column] === 0) {
            return row;
        }
    }
    return -1; // Column is full
}

function simulateGame(board, currentPlayer) {
    while (true) {
        const availableColumns = getAvailableColumns(board);
        if (availableColumns.length === 0) {
            return 0;
        }
        const randomColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];
        board = makeMove(board, randomColumn, currentPlayer);
        const winner = checkWin1(board);
        if (winner !== 0) {
            return winner;
        }
        currentPlayer = 3 - currentPlayer; 
    }
}


function getAvailableColumns(board) {
    const columns = [];
    for (let column = 0; column < 7; column++) {
        if (board[0][column] === 0) {
            columns.push(column);
        }
    }
    return columns;
}


function checkWin1(board) {
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

    return 0;
}

function copyBoard(board) {
    const newBoard = JSON.parse(JSON.stringify(board));
    // for (let row = 0; row < 6; row++) {
    //     newBoard.push(board[row].slice());
    // }
    return newBoard;
}
