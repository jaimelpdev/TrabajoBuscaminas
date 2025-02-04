let minas = 10;
let board = Array(10).fill(0).map(() => Array(10).fill(0));

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
            cell.classList.add('cell');
            cell.style.backgroundImage = "url('../imgs/grass.webp')";
            cell.style.backgroundSize = "cover";
            gameBoard.appendChild(cell);
        }
    }
}

// Call the function
window.onload = createBoard;

// A function that creates the mines randomly on the board (10 mines)

// A function that counts the mines around a cell (10 mines)
function countMines(x, y) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            board[i][j] = 0;
        }
    }
}