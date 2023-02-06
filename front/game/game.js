src="https://cdn.socket.io/socket.io-1.4.5.js"

const socket = io.connect('http://localhost:3000/api/game');
socket.on('connect', () => {
    console.log('Connected to the game namespace');
});

socket.on('newGame', data => {
    console.log('Received newGame event with data:', data);
    // Listen for the updatedBoard event here
    socket.on('updatedBoard', data => {
        console.log('Received updatedBoard event with data:', data);
        // Emit the newMove event here
        socket.emit('newMove', { message: 'Making a new move' });
    });
});
