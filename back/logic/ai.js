function computeMove(gameState) {
    while(true) {
        // Get a random column (integer between 0 and 6)
        let i = Math.floor(Math.random() * 7);
        for (let j=0 ; j<=5 ; j++) {
            if (gameState.board[i][j] === 0) {
                return [i, j];
            }
        }
    }
}
const http = require('http');
const io = require('socket.io');

const server = http.createServer((req, res) => {
    res.writeHead(404);
    res.end();
});

// Initialize the game state
let gameState = {
    board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
    ],
    playerTurn: 'red',
    gameOver: false
};

// Setup a new game on each new socket connection
io(server).on('connection', (socket) => {
    socket.emit('updatedBoard', gameState);

    socket.on('newMove', (column) => {
        // Check if the move is legal
        if (gameState.board[0][column] !== null) {
            console.log('Illegal move: column is full');
            return;
        }

        let row = gameState.board.length - 1;
        while (row >= 0 && gameState.board[row][column] !== null) {
            row--;
        }

        // Update the game state with the new move
        gameState.board[row][column] = gameState.playerTurn;
        gameState.playerTurn = gameState.playerTurn === 'red' ? 'yellow' : 'red';

        // Emit the updated game state
        socket.emit('updatedBoard', gameState);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Connect4 game backend listening on port 3000');
});
