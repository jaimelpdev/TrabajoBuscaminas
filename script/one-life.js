function placeMines() {
  let freeCell = {
    row: Math.floor(Math.random() * 10),
    col: Math.floor(Math.random() * 10),
  };
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i !== freeCell.row || j !== freeCell.col) {
        board[i][j] = "M"; // Place a mine
      }
    }
  }
}
