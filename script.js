const cells = Array.from(document.querySelectorAll(".cell"));
const status = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let board = Array(9).fill("");
let current = "X";
let active = true;

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function updateStatus() {
  status.textContent = active ? `Turno: ${current}` : status.textContent;
}

function handleClick(e) {
  const i = Number(e.target.dataset.index);
  if (!active || board[i]) return;
  board[i] = current;
  e.target.textContent = current;
  checkResult();
}

function checkResult() {
  for (const combo of wins) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      active = false;
      status.textContent = `Gana: ${board[a]}`;
      highlight(combo);
      return;
    }
  }
  if (board.every(Boolean)) {
    active = false;
    status.textContent = "Empate";
    return;
  }
  current = current === "X" ? "O" : "X";
  updateStatus();
}

function highlight(combo) {
  combo.forEach((i) => cells[i].classList.add("win"));
}

function reset() {
  board = Array(9).fill("");
  current = "X";
  active = true;
  cells.forEach((c) => {
    c.textContent = "";
    c.classList.remove("win");
  });
  status.textContent = `Turno: ${current}`;
}

cells.forEach((c) => c.addEventListener("click", handleClick));
resetBtn.addEventListener("click", reset);
