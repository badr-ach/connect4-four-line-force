export const checkWin = ({ board, currPlayer, rows, columns }) => {
  //check horizontal
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns - 3; j++) {
      if (
        board[i][j] !== 0 &&
        board[i][j] === board[i][j + 1] &&
        board[i][j] === board[i][j + 2] &&
        board[i][j] === board[i][j + 3]
      ) {
        return {
          gameOver: true,
          winner: currPlayer,
        };
      }
    }
  }

  //check vertical
  for (let i = 0; i < rows - 3; i++) {
    for (let j = 0; j < columns; j++) {
      if (
        board[i][j] !== 0 &&
        board[i][j] === board[i + 1][j] &&
        board[i][j] === board[i + 2][j] &&
        board[i][j] === board[i + 3][j]
      ) {
        return {
          gameOver: true,
          winner: currPlayer,
        };
      }
    }
  }

  //check diagonal
  for (let i = 0; i < rows - 3; i++) {
    for (let j = 0; j < columns - 3; j++) {
      if (
        board[i][j] !== 0 &&
        board[i][j] === board[i + 1][j + 1] &&
        board[i][j] === board[i + 2][j + 2] &&
        board[i][j] === board[i + 3][j + 3]
      ) {
        return {
          gameOver: true,
          winner: currPlayer,
        };
      }
    }
  }

  //check diagonal
  for (let i = 0; i < rows - 3; i++) {
    for (let j = 3; j < columns; j++) {
      if (
        board[i][j] !== 0 &&
        board[i][j] === board[i + 1][j - 1] &&
        board[i][j] === board[i + 2][j - 2] &&
        board[i][j] === board[i + 3][j - 3]
      ) {
        return {
          gameOver: true,
          winner: currPlayer,
        };
      }
    }
  }

  //check tie
  let tie = true;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] === 0) {
        tie = false;
      }
    }
  }

  if (tie) {
    return {
      gameOver: true,
      winner: "Tie",
    };
  }

  return {
    gameOver: false,
    winner: null,
  };
};
