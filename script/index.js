let mines = 10;
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
  if (infoElement.style.display === "none" || infoElement.style.display === "") {
    infoElement.style.display = "flex";
  } else {
    infoElement.style.display = "none";
  }
});

//Stopwatch variables

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
  let placedMines = 0;
  while (placedMines < mines) {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    if (board[row][col] === 0) {
      board[row][col] = 1; // Place a mine
      placedMines++;
    }
  }
}

// Function to handle cell click
function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  if (firstClick) {
    firstClick = false;
    if (board[row][col] === "M") {
      board[row][col] = 0;
      placeMines();
      while (board[row][col] === "M") {
        board[row][col] = 0;
        placeMines();
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
    console.log("Game Over! Setting TNT image.");
    cell.style.backgroundImage = "none"; // Remove the grass image
    cell.style.backgroundImage = "url('../imgs/tntoverstone.webp')"; // Set the TNT image over the stone
    cell.style.backgroundSize = "cover"; // Ensure the image covers the cell
    cell.style.backgroundRepeat = "no-repeat"; // Ensure the image does not repeat

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

// Function to check if the player has won
function youWin() {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (board[i][j] === "M" && !flagged[i][j]) {
        return false; // If any mine is not flagged, the player hasn't won yet
      }
    }
  }
  window.location.href = "youWin.html"; // Redirect to youWin.html
  return true; // All mines are flagged
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

// Add event listener to the reset button
document.getElementById("reset-game").addEventListener("click", resetGame);

// Call the function to initialize the game
window.onload = initGame;

//Modal
function initializeRulesModal() {
  // Get elements
  const rulesButton = document.getElementById("question");
  const rulesModal = document.getElementById("rulesModal");
  const closeModal = document.getElementById("closeModal");

  // Show modal when button is clicked
  rulesButton.addEventListener("click", () => {
    rulesModal.style.display = "flex";
  });

  // Close modal when "Close" button is clicked
  closeModal.addEventListener("click", () => {
    rulesModal.style.display = "none";
  });

  // Close modal when clicking outside the modal content
  window.addEventListener("click", (event) => {
    if (event.target === rulesModal) {
      rulesModal.style.display = "none";
    }
  });
}

// Initialize the modal functionality when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeRulesModal);

//End Modal

// Manage difficulty selection
document
  .getElementById("difficulty-select")
  .addEventListener("change", function () {
    const selectedValue = this.value;
    window.location.href = selectedValue;
  });
