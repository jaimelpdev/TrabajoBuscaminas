let minas = 10;
let banderasRestantes = minas; // Variable para rastrear el número de banderas restantes
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
  if (gameOver) return; // Prevent clicks if game is over
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  if (!flagged[row][col]) {
    revealCell(row, col);
  }
}

// Function to handle cell right-click (to place/remove flags)
function handleCellRightClick(event) {
  event.preventDefault();
  if (gameOver) return; // Prevent right-clicks if game is over
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  toggleFlag(row, col);
}

// Function to toggle flag on a cell
function toggleFlag(row, col) {
  if (revealed[row][col]) return;
  const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  if (flagged[row][col]) {
    flagged[row][col] = false;
    banderasRestantes++;
    cell.style.backgroundImage = "url('../imgs/grass.webp')";
  } else {
    if (banderasRestantes > 0) {
      flagged[row][col] = true;
      banderasRestantes--;
      cell.style.backgroundImage = "url('../imgs/flag.webp')";
    } else {
      alert("No more flags available!");
    }
  }
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
      } else {
        setTimeout(() => {
          alert("Game Over!");
          initGame();
        }, 200); // Delay the alert until all mines are revealed
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
  banderasRestantes = minas; // Reset the number of remaining flags
  gameOver = false; // Reset game over state
  createBoard();
  placeMines();
  countMines();
}

// Call the function
window.onload = initGame;
