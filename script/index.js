let mines = 50;
let remainingFlags = mines;
let minesPlaced = false;
let firstClick = true; // Variable to track the first click
let clickCount = 0; // Variable to track the number of clicks

let board = Array(10)
  .fill(0)
  .map(() => Array(10).fill(0));
let revealed = Array(10)
  .fill(0)
  .map(() => Array(10).fill(false));
let flagged = Array(10)
  .fill(0)
  .map(() => Array(10).fill(false));
let gameOver = false; // Variable to track game over state

// Modes section
document.getElementById("enchantedbook").addEventListener("click", function () {
  const modesElement = document.getElementById("modes");
  if (modesElement.classList.contains("show")) {
    modesElement.classList.remove("show");
  } else {
    modesElement.classList.add("show");
  }
});

let gameMode = "normal"; // Variable to track the current game mode

document.getElementById("first-click").addEventListener("click", function () {
  gameMode = "first-click";
  resetGame();
});

document.getElementById("one-life").addEventListener("click", function () {
  gameMode = "one-life";
  resetGame();
});

// Function to update the info section
function updateInfo() {
  document.getElementById(
    "num-mines"
  ).innerHTML = `<img src="../imgs/tnt.webp" alt="tnt">${mines}`;
  document.getElementById(
    "num-flags"
  ).innerHTML = `<img src="../imgs/diamond_pickaxe.webp" alt="diamond pickaxe">${remainingFlags}`;
  document.getElementById(
    "num-clicks"
  ).innerHTML = `<img src="../imgs/click.webp" alt="mouse click">${clickCount}`;
}

document.getElementById("datatoggle").addEventListener("click", function () {
  const infoElement = document.getElementById("info");
  if (
    infoElement.style.display === "none" ||
    infoElement.style.display === ""
  ) {
    infoElement.style.display = "flex";
  } else {
    infoElement.style.display = "none";
  }
});

//Stopwatch variables
let timerInterval;
let timerRunning = false;
let elapsedTime = 0;

// Function to start the stopwatch
function startStopwatch() {
  if (timerRunning || !firstClick) return; // Prevent multiple intervals and ensure it's the first click
  timerRunning = true;
  const startTime = Date.now() - elapsedTime;

  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    document.getElementById("stopwatch").textContent = `${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 1000);
}

// Function to stop the stopwatch
function stopStopwatch() {
  clearInterval(timerInterval);
  timerRunning = false;
}

// Add event listener to the timer image
document
  .getElementById("timertoggle")
  .addEventListener("click", startStopwatch);

// A function that creates the board 10x10
function createBoard() {
  const gameBoard = document.getElementById("game-board");
  if (!gameBoard) {
    console.error("Element with id 'game-board' not found.");
    return;
  }
  gameBoard.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.backgroundImage = "url('../imgs/grass.webp')";
      cell.style.backgroundSize = "cover";
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleCellClick);
      cell.addEventListener("contextmenu", handleCellRightClick);
      gameBoard.appendChild(cell);
    }
  }
}

// Function to place mines
function placeMines() {
  if (gameMode === "one-life") {
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
  } else {
    let placedMines = 0;
    while (placedMines < mines) {
      let row = Math.floor(Math.random() * 10);
      let col = Math.floor(Math.random() * 10);
      if (board[row][col] === 0) {
        board[row][col] = "M"; // Place a mine
        placedMines++;
      }
    }
  }
}

// Function to handle cell click
function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  if (firstClick) {
    firstClick = false;
    if (gameMode === "first-click") {
      if (board[row][col] === "M") {
        revealCell(row, col);
        gameOver = true;
        return;
      }
    } else {
      if (board[row][col] === "M") {
        board[row][col] = 0;
        placeMines();
        while (board[row][col] === "M") {
          board[row][col] = 0;
          placeMines();
        }
      }
    }
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

// Function to place mines after the first click
function placeMinesAfterFirstClick(firstRow, firstCol) {
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    if (board[row][col] === 0 && !isAdjacent(firstRow, firstCol, row, col)) {
      board[row][col] = "M";
      minesPlaced++;
    }
  }
}

// Function to count mines around each cell
function countMines() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (board[i][j] !== "M") {
        let mineCount = 0;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (i + x >= 0 && i + x < 10 && j + y >= 0 && j + y < 10) {
              if (board[i + x][j + y] === "M") {
                mineCount++;
              }
            }
          }
        }
        board[i][j] = mineCount;
      }
    }
  }
}

// Function to handle cell right-click (to place/remove flags)
function handleCellRightClick(event) {
  event.preventDefault();
  if (gameOver) return; // Prevent right-clicks if game is over
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  toggleFlag(row, col);
  updateInfo(); // Update info section
}

function isAdjacent(firstRow, firstCol, row, col) {
  return Math.abs(firstRow - row) <= 1 && Math.abs(firstCol - col) <= 1;
}

// Function to toggle flag on a cell
function toggleFlag(row, col) {
  if (revealed[row][col]) return;
  const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  if (flagged[row][col]) {
    flagged[row][col] = false;
    remainingFlags++;
    if (board[row][col] === "M") {
      mines++; // Increment mines if flag is removed from a mine
    }
    cell.style.backgroundImage = "url('../imgs/grass.webp')";
  } else {
    if (remainingFlags > 0) {
      flagged[row][col] = true;
      remainingFlags--;
      cell.style.backgroundImage = "url('../imgs/flag.webp')";
      setTimeout(() => {
        if (youWin()) {
          gameOver = true;
        }
      }, 100); // Delay to ensure the flag is shown before checking win condition
    } else {
      console.log("No remaining flags available.");
    }
  }
  updateInfo(); // Update info section
}

// Function to reveal a cell
function revealCell(row, col) {
  if (
    row < 0 ||
    row >= 10 ||
    col < 0 ||
    col >= 10 ||
    revealed[row][col] ||
    flagged[row][col]
  ) {
    return;
  }
  revealed[row][col] = true;
  const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  if (board[row][col] === "M") {
    gameOver = true; // Set game over state
    stopStopwatch(); // Stop the stopwatch
    console.log("Game Over! Setting TNT image.");
    cell.style.backgroundImage = "none"; // Remove the grass image
    cell.style.backgroundImage = "url('../imgs/tntoverstone.webp')"; // Set the TNT image over the stone
    cell.style.backgroundSize = "cover"; // Ensure the image covers the cell

    // Reveal all mines one by one
    let mineIndex = 0;
    const mines = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (board[r][c] === "M" && !(r === row && c === col)) {
          mines.push({ r, c });
        }
      }
    }

    const revealNextMine = () => {
      if (mineIndex < mines.length) {
        const { r, c } = mines[mineIndex];
        const mineCell = document.querySelector(
          `[data-row='${r}'][data-col='${c}']`
        );
        mineCell.style.backgroundImage = "url('../imgs/tntoverstone.webp')";
        mineCell.style.backgroundSize = "cover";
        mineCell.style.backgroundRepeat = "no-repeat";
        mineIndex++;
        setTimeout(revealNextMine, 500); // Delay between revealing each mine
      }
    };

    revealNextMine();
  } else {
    cell.style.backgroundImage = "url('../imgs/rock.webp')";
    cell.style.backgroundSize = "cover"; // Ensure the image covers the cell
    cell.style.backgroundRepeat = "no-repeat"; // Ensure the image does not repeat
    cell.textContent = board[row][col] === 0 ? "" : board[row][col];
    if (board[row][col] === 0) {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          revealCell(row + x, col + y);
        }
      }
    }
  }
}

// Function to reset the game
function resetGame() {
  // Reset game variables
  firstClick = true;
  minesPlaced = false;
  gameOver = false;

  // Clear the board
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      board[i][j] = 0;
      revealed[i][j] = false;
      flagged[i][j] = false;
    }
  }

  // Reset remaining flags
  remainingFlags = mines;
  clickCount = 0; // Reset click count

  // Recreate the board and place mines
  createBoard();
  placeMines();
  countMines();
  updateInfo(); // Update info section
}

// Initialize the game
function initGame() {
  board = Array(10)
    .fill(0)
    .map(() => Array(10).fill(0));
  revealed = Array(10)
    .fill(0)
    .map(() => Array(10).fill(false));
  flagged = Array(10)
    .fill(0)
    .map(() => Array(10).fill(false));
  remainingFlags = mines; // Reset the number of remaining flags
  clickCount = 0; // Reset click count
  gameOver = false; // Reset game over state
  createBoard();
  placeMines();
  countMines();
  updateInfo(); // Update info section
}

document.addEventListener("DOMContentLoaded", initGame);
