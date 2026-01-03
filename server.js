const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

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

// rooms: Map roomId -> { players: [{id,symbol}], board, current, winner, winCombo }
const rooms = new Map();

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    try {
      // data: { roomId?, name?, password? }
      let requestedId = null;
      let name = "Jugador";
      let password = null;
      if (typeof data === "string") requestedId = data;
      else if (data && typeof data === "object") {
        requestedId = data.roomId || null;
        name = data.name || name;
        password = data.password || null;
      }

      if (!requestedId) requestedId = Math.random().toString(36).slice(2, 8);
      let room = rooms.get(requestedId);
      if (!room) {
        room = {
          players: [],
          board: Array(9).fill(""),
          current: "X",
          winner: null,
          winCombo: null,
          password: password || null,
        };
        rooms.set(requestedId, room);
      }

      // If room exists and has password, require match
      if (room.password && room.password !== password) {
        socket.emit("errorMessage", "Contraseña incorrecta");
        return;
      }

      if (room.players.length >= 2) {
        socket.emit("errorMessage", "Sala llena");
        return;
      }

      const symbol = room.players.length === 0 ? "X" : "O";
      room.players.push({ id: socket.id, symbol, name });
      socket.join(requestedId);
      socket.roomId = requestedId;
      socket.symbol = symbol;
      socket.playerName = name;

      const ready = room.players.length === 2;
      // inform the joining socket
      socket.emit("joined", {
        roomId: requestedId,
        symbol,
        board: room.board,
        current: room.current,
        ready,
        players: room.players.map((p) => ({ name: p.name, symbol: p.symbol })),
      });
      // broadcast participants and state
      io.to(requestedId).emit(
        "participants",
        room.players.map((p) => ({ name: p.name, symbol: p.symbol }))
      );
      io.to(requestedId).emit("roomState", {
        board: room.board,
        current: room.current,
        ready,
      });
    } catch (err) {
      console.error("join error", err);
    }
  });

  socket.on("move", ({ index }) => {
    const roomId = socket.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || room.winner) return;
    if (socket.symbol !== room.current) return;
    if (room.board[index]) return;

    room.board[index] = socket.symbol;

    // check winner
    for (const combo of wins) {
      const [a, b, c] = combo;
      if (
        room.board[a] &&
        room.board[a] === room.board[b] &&
        room.board[a] === room.board[c]
      ) {
        room.winner = room.board[a];
        room.winCombo = combo;
        io.to(roomId).emit("gameOver", {
          winner: room.winner,
          board: room.board,
          winCombo: combo,
        });
        return;
      }
    }

    if (room.board.every(Boolean)) {
      io.to(roomId).emit("gameOver", {
        winner: null,
        board: room.board,
        winCombo: null,
      });
      return;
    }

    room.current = room.current === "X" ? "O" : "X";
    io.to(roomId).emit("roomState", {
      board: room.board,
      current: room.current,
      ready: room.players.length === 2,
    });
  });

  socket.on("reset", () => {
    const roomId = socket.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    room.board = Array(9).fill("");
    room.current = "X";
    room.winner = null;
    room.winCombo = null;
    io.to(roomId).emit("roomState", {
      board: room.board,
      current: room.current,
      ready: room.players.length === 2,
    });
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    room.players = room.players.filter((p) => p.id !== socket.id);
    room.winner = null;
    room.winCombo = null;
    if (room.players.length === 0) {
      rooms.delete(roomId);
    } else {
      io.to(roomId).emit("playerLeft", { message: "Un jugador se desconectó" });
    }
  });
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
