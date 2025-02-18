function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  if (firstClick) {
    firstClick = false;
    // No garantizamos que el primer click sea seguro
  }

  if (!minesPlaced) {
    placeMinesAfterFirstClick(row, col);
    countMines();
    minesPlaced = true;
  }

  if (gameOver) return; // Prevent clicks if game is over
  if (!flagged[row][col]) {
    revealCell(row, col);
    clickCount++; // Increment click count
    updateInfo(); // Update info section
    if (checkWin()) {
      gameOver = true;
    }
  }
}
