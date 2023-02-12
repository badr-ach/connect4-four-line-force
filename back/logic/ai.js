
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



