import { io } from "socket.io-client";

import Board from "../classes/board";
import Ball from "../classes/ball";
import Player from "../classes/player";
import Paddle from "../classes/paddle";
import gameUI from "../DOM/gameUI";

import paddleController from "../functions/paddleController";
import displayWinner from "../functions/displayWinner";
import updateScore from "../functions/updateScore";

const gameServerHost = "127.0.0.1:5000";
let lastTime;

async function apiCall(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

async function createGame() {
  return apiCall(`http://${gameServerHost}/new_game`);
}
async function joinGame(gameId) {
  return apiCall(`http://${gameServerHost}/join_game/${gameId}`);
}

async function getGameStatus(gameId) {
  const response = await apiCall(`http://${gameServerHost}/status/${gameId}`);
  return response.state;
}

async function waitForActiveStatus(gameId) {
  const status = await getGameStatus(gameId);
  console.log(status);
  if (status !== "ACTIVE") {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    return waitForActiveStatus(gameId);
  }
}

function receiveUpdate(socket, board) {
  const player1 = board.players[0];
  const player2 = board.players[1];
  const { ball } = board;

  socket.on("game_state_updated", (data) => {
    if (player2.type === "server") {
      if (data.right_paddle !== undefined) {
        player2.paddle.y = data.right_paddle;
      }
    } else if (player1.type === "server") {
      if (data.ball) {
        ball.positionX = data.ball.position_x;
        ball.positionY = data.ball.position_y;
      }
      if (data.left_paddle !== undefined) {
        player1.paddle.y = data.left_paddle;
      }
      if (data.rounds) {
        board.setRounds(parseFloat(data.rounds));
      }
      if (data.scores) {
        player1.setScore(data.scores[0]);
        player2.setScore(data.scores[1]);
        updateScore(board);
      }
      if (data.winner) {
        board.setWinner(data.winner);
        displayWinner(board.winner, board.players);
      }
    }
  });

  socket.on("game_pause_updated", (data) => {
    board.isPaused = data.isPaused;
    if (board.isPaused) {
      console.log("checking board");
      startCountdown(board, socket);
    }
  });
}

function sendUpdate(socket, board, ball, player1, player2) {
  if (player2.type === "server") {
    const gameState = {
      ball: {
        position_x: ball.positionX,
        position_y: ball.positionY,
      },
      paddle: {
        position: player1.paddle.y,
      },
      rounds: board.rounds,
      scores: [player1.score, player2.score],
      winner: board.winner.name || board.winner,
    };
    socket.emit("update_game_state_left", gameState);
  } else if (player1.type === "server") {
    const gameState = {
      paddle: {
        position: player2.paddle.y,
      },
    };
    socket.emit("update_game_state_right", gameState);
  }
}

function sendPauseUpdate(board, socket) {
  console.log("sending");
  const gameState = {
    isPaused: board.isPaused,
  };
  socket.emit("game_pause_updated", gameState);
}

function gameLoop(board, socket, time) {
  if (board.isPaused) {
    return;
  }
  const { ctx } = board;
  const { canvas } = board;
  const player1 = board.players[0];
  const player2 = board.players[1];
  const { ball } = board;

  const delta = (time - lastTime) / 1000;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player1.paddle.movePaddle(canvas);

  player2.paddle.movePaddle(canvas);

  player1.paddle.draw(ctx);

  player2.paddle.draw(ctx);

  ball.draw(ctx);

  if (player1.type === "host") {
    const isWin = ball.moveBall(canvas, player1, player2, delta);
    if (isWin) {
      board.updateRounds();
      updateScore(board);

      if (board.rounds === 10) {
        let winner;
        if (player1.score > player2.score) {
          winner = player1.name;
        } else if (player1.score < player2.score) {
          winner = player2.name;
        } else {
          winner = "It's a tie!";
        }
        board.setWinner(winner);
        displayWinner(winner, board.players);
      }

      if (!board.winner) {
        board.isPaused = true;
        sendPauseUpdate(board, socket);
      }

      ball.reset(canvas);
      player1.paddle.reset(canvas);
      player2.paddle.reset(canvas);
    }
  }
  sendUpdate(socket, board, ball, player1, player2);

  if (!board.winner) {
    requestAnimationFrame((newTime) => gameLoop(board, socket, newTime));
  }
}

async function initializeGame(joining = false) {
  const duration = 10000;

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timed out")), duration);
  });

  try {
    const data = await Promise.race([
      joining ? joinGame(joining) : createGame(),
      timeoutPromise,
    ]);
    return data;
  } catch (error) {
    console.log("Please try again!", error);
  }
}

function initializePlayers(canvas, players, data) {
  if (data.player.type === "host") {
    const player1Paddle = new Paddle(
      40,
      canvas.height / 2 - 50,
      "left",
      10,
      100,
    );

    const player1 = new Player(
      `${data.player.type}`,
      `${data.player.name}`,
      player1Paddle,
      parseFloat(data.player.score),
    );

    const player2Paddle = new Paddle(
      canvas.width - 50,
      canvas.height / 2 - 50,
      "right",
      10,
      100,
    );

    const player2 = new Player("server", "Player 2", player2Paddle, 0);
    players.push(player1);
    players.push(player2);

    paddleController(player1);
  } else if (data.player.type === "guest") {
    const player2Paddle = new Paddle(
      canvas.width - 50,
      canvas.height / 2 - 50,
      "right",
      10,
      100,
    );

    const player2 = new Player(
      `${data.player.type}`,
      `${data.player.name}`,
      player2Paddle,
      parseFloat(data.player.score),
    );

    const player1Paddle = new Paddle(
      40,
      canvas.height / 2 - 50,
      "left",
      10,
      100,
    );

    const player1 = new Player("server", "Player 1", player1Paddle, 0);

    players.push(player1);
    players.push(player2);

    paddleController(player2);
  }
}

export default async function controllerMultiplayer(joining = false) {
  try {
    const data = await initializeGame(joining);

    if (data) {
      console.log(data.id);
      gameUI();
      const socket = io(`http://${gameServerHost}`, {
        transports: ["websocket", "polling"],
        query: { id: data.id },
      });

      const canvas = document.querySelector(".canvas");
      const ctx = canvas.getContext("2d"); // Gives me canvas workspace

      const players = [];
      initializePlayers(canvas, players, data);

      players.forEach((player) => {
        player.paddle.draw(ctx);
      });

      const ball = new Ball(
        { x: 0.75, y: 0.5 },
        canvas.width / 2,
        canvas.height / 2,
        10,
      );

      const board = new Board(canvas, ctx, players, 0, ball, false);

      updateScore(board);
      ctx.font = "48px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      socket.on("connect", async () => {
        receiveUpdate(socket, board);
        console.log("Successfully connected to the server");

        await waitForActiveStatus(data.id);
        startCountdown(board, socket);
      });

      socket.on("connect_error", (err) => {
        console.error("Connection failed:", err);
      });
      return { ok: true };
    }
  } catch (error) {
    console.error("Error in controllerMultiplayer:", error);
    return { ok: false };
  }
}

function startCountdown(board, socket) {
  console.log("in countdown");
  let countdown = 3;
  const { ctx } = board;
  const { canvas } = board;
  const player1 = board.players[0];
  const player2 = board.players[1];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player1.paddle.draw(ctx);
  player2.paddle.draw(ctx);

  setTimeout(() => {
    ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
    const countdownInterval = setInterval(() => {
      countdown -= 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      player1.paddle.draw(ctx);
      player2.paddle.draw(ctx);

      if (countdown > 0) {
        ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
      } else {
        board.isPaused = false;
        sendPauseUpdate(board, socket);
        clearInterval(countdownInterval);
        requestAnimationFrame((time) => {
          console.log("in animation");
          lastTime = time;
          gameLoop(board, socket, time);
        });
      }
    }, 1000);
  }, 100);
}
