let minas = 10;
let board = Array(10)
  .fill(0)
  .map(() => Array(10).fill(0));
let revealed = Array(10)
  .fill(0)
  .map(() => Array(10).fill(false));
let flagged = Array(10)
  .fill(0)
  .map(() => Array(10).fill(false));

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

// Function to place mines randomly on the board
function placeMines() {
  let minesPlaced = 0;
  while (minesPlaced < minas) {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    if (board[row][col] === 0) {
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

// Function to handle cell click
function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  if (!flagged[row][col]) {
    revealCell(row, col);
  }
}

// Function to handle cell right-click (to place/remove flags)
function handleCellRightClick(event) {
  event.preventDefault();
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  toggleFlag(row, col);
}

// Function to toggle flag on a cell
function toggleFlag(row, col) {
  if (revealed[row][col]) return;
  flagged[row][col] = !flagged[row][col];
  const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  if (flagged[row][col]) {
    cell.style.backgroundImage = "url('../imgs/diamond_pickaxe.webp')";
  } else {
    cell.style.backgroundImage = "url('../imgs/grass.webp')";
  }
}

// Function to reveal a cell
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
      console.log("Game Over! Setting TNT image.");
      cell.style.backgroundImage = "none"; // Remove the grass image
      cell.style.backgroundImage = "url('../imgs/tntoverstone.webp')"; // Set the TNT image
      cell.style.backgroundSize = "cover"; // Ensure the image covers the cell
      cell.style.backgroundRepeat = "no-repeat"; // Ensure the image does not repeat
      setTimeout(() => {
        alert("Game Over!");
        initGame();
      }, 100); // Delay the alert by 100 milliseconds to appear after the TNT image
  
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
  createBoard();
  placeMines();
  countMines();
}

// Call the function
window.onload = initGame;
