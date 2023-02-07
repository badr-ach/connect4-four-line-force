
export default function getAiMove(gameState) {
    while(true) {
        // Get a random column (integer between 0 and 6)
        let i = Math.floor(Math.random() * 7);
        for (let j=5 ; j>=0 ; j--) {
            if (gameState.board[j][i] === 0) {
                return [j, i];
            }
        }
    }
}


// const game = io.of('/api/game');

// game.on('connection', socket => {
//     console.log('A client connected to the game namespace');
//     let board = [
//         [0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0]
//     ];
//     // Setup a new game here
//     socket.emit('newGame', { board: 'A new game has started!' });

//     // Handle the updatedBoard event
//     socket.on('updatedBoard', data => {
//         console.log('Received updatedBoard event with data:', data);

//         // A new move has been made
//         let { column, player } = data;
//         for (let i = board.length - 1; i >= 0; i--) {
//             if (board[i][column] === 0) {
//                 board[i][column] = player;
//                 break;
//             }
//         }

//         game.emit('newMove', { board });
//     });
// });





// // Setup a new game on each new socket connection
// io(server).on('connection', (socket) => {
//     socket.emit('updatedBoard', gameState);

//     socket.on('newMove', (column) => {
//         // Check if the game is over
//         if (gameState.gameOver) {
//             console.log('Illegal move: game is already over');
//             return;
//         }
//         // Check if the move is legal
//         if (gameState.board[0][column] !== null) {
//             console.log('Illegal move: column is full');
//             return;
//         }

//         let row = gameState.board.length - 1;
//         while (row >= 0 && gameState.board[row][column] !== null) {
//             row--;
//         }



//         // Update the game state with the new move
//         gameState.board[row][column] = gameState.playerTurn;

//         // Check if the game is won
//         let winner = checkForWin(gameState.board, row, column);
//         if (winner) {
//             gameState.gameOver = true;
//             socket.emit('gameOver', winner);
//             return;
//         }

//         gameState.playerTurn = gameState.playerTurn === 'red' ? 'yellow' : 'red';

//         // Play a move if it's the AI's turn
//         if (gameState.playerTurn === 'yellow') {
//             let aiMove = getAIMove(gameState);
//             gameState.board[aiMove.row][aiMove.column] = 'yellow';
//             gameState.playerTurn = 'red';
//         }

//         // Emit the updated game state
//         socket.emit('updatedBoard', gameState);
//     });
// });


