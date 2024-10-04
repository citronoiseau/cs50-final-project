import Board from "../classes/board";
import Ball from "../classes/ball";
import Player from "../classes/player";
import Paddle from "../classes/paddle";
import gameUI from "../DOM/gameUI";
import drawText from "../functions/drawText";

import paddleController from "../functions/paddleController";
import displayWinner from "../functions/displayWinner";
import updateScore from "../functions/updateScore";

let gameOver = false;
let lastTime;
let animationId;
let countAnimationId;
let countdownInterval;

function stopGameLoop() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    gameOver = true;
    countdownInterval = null;
  }
  if (animationId) {
    gameOver = true;
    cancelAnimationFrame(animationId);
    animationId = null; // Reset the animation ID
  }
  if (countAnimationId) {
    gameOver = true;
    cancelAnimationFrame(countAnimationId);
    countAnimationId = null; // Reset the animation ID
  }
}

function gameLoop(board, time) {
  if (gameOver || board.isPaused) return;
  const canvasCheck = document.querySelector(".canvas");
  if (!canvasCheck) return;
  const { ctx } = board;
  const { canvas } = board;
  const player1 = board.players[0];
  const player2 = board.players[1];
  const { ball } = board;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const delta = (time - lastTime) / 1000;
  lastTime = time;

  player1.paddle.movePaddle(canvas);
  if (player2.type === "bot") {
    player2.paddle.moveBotPaddle(board);
  } else {
    player2.paddle.movePaddle(canvas);
  }

  player1.paddle.draw(ctx);
  player2.paddle.draw(ctx);

  ball.draw(ctx);
  const isWin = ball.moveBall(canvas, player1, player2, delta);
  if (isWin) {
    board.isPaused = true;
    board.updateRounds();
    updateScore(board);
    if (board.rounds === board.maxRounds) {
      let winner;
      if (player1.score > player2.score) {
        winner = player1.name;
      } else if (player1.score < player2.score) {
        winner = player2.name;
      } else {
        winner = "It's a tie!";
      }

      stopGameLoop();
      displayWinner(winner, board.players);
      return;
    }

    startCountdown(board);
    ball.reset(canvas);
    player1.paddle.reset(canvas);
    player2.paddle.reset(canvas);
  }
  if (!board.isPaused) {
    animationId = requestAnimationFrame((newTime) => gameLoop(board, newTime));
  }
}

function startCountdown(board) {
  if (gameOver) return;
  const canvasCheck = document.querySelector(".canvas");
  if (!canvasCheck) return;
  let countdown = 3;
  const { ctx } = board;
  const { canvas } = board;
  const player1 = board.players[0];
  const player2 = board.players[1];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player1.paddle.draw(ctx);
  player2.paddle.draw(ctx);

  setTimeout(() => {
    drawText(ctx, countdown, canvas.width / 2, canvas.height / 2);
    countdownInterval = setInterval(() => {
      countdown -= 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      player1.paddle.draw(ctx);
      player2.paddle.draw(ctx);

      if (countdown > 0) {
        drawText(ctx, countdown, canvas.width / 2, canvas.height / 2);
      } else {
        clearInterval(countdownInterval);
        board.isPaused = false;
        countAnimationId = requestAnimationFrame((time) => {
          lastTime = time;
          gameLoop(board, time);
        });
      }
    }, 1000);
  }, 100);
}

export default function controller(bot = false, rounds) {
  let gameStarted = false;
  stopGameLoop();
  gameUI();
  const canvas = document.querySelector(".canvas");
  const ctx = canvas.getContext("2d"); // Gives me canvas workspace

  const player1Paddle = new Paddle(
    40,
    canvas.height / 2 - 50,
    "left",
    7,
    40,
    100,
  );
  const player1 = new Player("player", "Player 1", player1Paddle, 0);

  const player2Paddle = new Paddle(
    canvas.width - 80,
    canvas.height / 2 - 50,
    "right",
    7,
    40,
    100,
  );

  const player2 = bot
    ? new Player("bot", "Bot", player2Paddle, 0)
    : new Player("player", "Player 2", player2Paddle, 0);

  const players = [player1, player2];

  const ball = new Ball(
    { x: 0.75, y: 0.5 },
    canvas.width / 2,
    canvas.height / 2,
    20,
  );

  ball.reset(canvas);

  const board = new Board(canvas, ctx, players, 0, ball, false, rounds);
  player1.paddle.draw(ctx);
  player2.paddle.draw(ctx);
  updateScore(board);

  const x = canvas.width / 2;
  const y = canvas.height / 2;
  drawText(ctx, "Press ENTER to start", x, y);
  paddleController(player1, player2);
  updateScore(board);
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !gameStarted) {
      gameOver = false;
      gameStarted = true;
      startCountdown(board);
    }
  });
}
