// Cliente con Socket.IO — sincroniza estado con el servidor
const cells = Array.from(document.querySelectorAll(".cell"));
const status = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const roomInput = document.getElementById("room");
const createBtn = document.getElementById("create-room");
const roomInfo = document.getElementById("room-info");
const nameInput = document.getElementById("name");
const passInput = document.getElementById("room-pass");
const participantsEl = document.getElementById("participants");

let symbol = null;
let ready = false;
let roomId = null;
let board = Array(9).fill("");
let current = null;

const socket = io();

createBtn.addEventListener("click", () => {
  const id = (roomInput.value || "").trim();
  const name = (nameInput.value || "").trim();
  const password = (passInput.value || "").trim() || null;
  if (!name) {
    alert("Introduce un nombre");
    return;
  }
  if (!id) {
    alert("Introduce el código de sala");
    return;
  }
  socket.emit("join", { roomId: id, name, password });
});

function renderBoard(b) {
  board = b.slice();
  cells.forEach((c, i) => {
    c.textContent = board[i] || "";
    c.classList.remove("win");
  });
}

function setStatus(text) {
  status.textContent = text;
}

socket.on("joined", (data) => {
  roomId = data.roomId;
  symbol = data.symbol;
  ready = data.ready;
  renderBoard(data.board);
  current = data.current;
  roomInfo.textContent = `Sala: ${roomId} — Eres: ${symbol}`;
  // show game, hide lobby
  document.getElementById("lobby").style.display = "none";
  document.getElementById("game").style.display = "block";
  if (data.players) renderParticipants(data.players);
  setStatus(
    ready
      ? current === symbol
        ? "Tu turno"
        : "Turno rival"
      : "Esperando jugador..."
  );
});

socket.on("roomState", (data) => {
  renderBoard(data.board);
  current = data.current;
  ready = data.ready;
  if (!ready) setStatus("Esperando jugador...");
  else setStatus(current === symbol ? "Tu turno" : "Turno rival");
});

socket.on("gameOver", (data) => {
  renderBoard(data.board);
  if (data.winCombo && data.winCombo.length === 3) {
    data.winCombo.forEach((i) => cells[i].classList.add("win"));
  }
  if (data.winner) {
    setStatus(data.winner === symbol ? "¡Has ganado!" : "Has perdido");
  } else {
    setStatus("Empate");
  }
});

socket.on("playerLeft", (info) => {
  setStatus("Rival desconectado — esperando...");
  // request updated participants list isn't necessary, server emits participants on disconnect
});

socket.on("errorMessage", (msg) => {
  alert(msg);
  setStatus(msg);
});

socket.on("participants", (players) => {
  renderParticipants(players);
});

function renderParticipants(players) {
  participantsEl.innerHTML = "";
  const ul = document.createElement("ul");
  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.name} — ${p.symbol}`;
    ul.appendChild(li);
  });
  participantsEl.appendChild(ul);
}

cells.forEach((c) =>
  c.addEventListener("click", (e) => {
    const i = Number(e.target.dataset.index);
    if (!ready) return;
    if (current !== symbol) return;
    if (board[i]) return;
    socket.emit("move", { index: i });
  })
);

resetBtn.addEventListener("click", () => {
  if (!roomId) return resetLocal();
  socket.emit("reset");
});

function resetLocal() {
  board = Array(9).fill("");
  renderBoard(board);
  setStatus("Turno: X");
}
