import Board from "../classes/board";
import Ball from "../classes/ball";
import Player from "../classes/player";
import Paddle from "../classes/paddle";
import gameUI from "../DOM/gameUI";

let isPaused = true;

function updateScore(board, player1Score, player2Score) {
  const scoreCanvas = document.querySelector(".scoreCanvas");
  const scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, scoreCtx.canvas.width, scoreCtx.canvas.height);

  scoreCtx.font = "30px Arial";
  scoreCtx.textAlign = "center";

  scoreCtx.fillText(
    `Player 1: ${player1Score}`,
    scoreCtx.canvas.width / 4,
    scoreCtx.canvas.height / 2,
  );
  scoreCtx.fillText(
    `Round: ${board.rounds}`,
    (2 * scoreCtx.canvas.width) / 4,
    scoreCtx.canvas.height / 2,
  );
  scoreCtx.fillText(
    `Player 2: ${player2Score}`,
    (3 * scoreCtx.canvas.width) / 4,
    scoreCtx.canvas.height / 2,
  );
}

function gameLoop(board) {
  const ctx = board.ctx;
  const canvas = board.canvas;
  const player1 = board.players[0];
  const player2 = board.players[1];
  const ball = board.ball;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player1.paddle.draw(ctx);
  player2.paddle.draw(ctx);

  if (!isPaused) {
    ball.draw(ctx);
    const isWin = ball.moveBall(canvas, player1, player2);
    if (isWin) {
      isPaused = true;
      updateScore(board, player1.score, player2.score);
      startCountdown(board);
      ball.reset(canvas);
      ball.setSpeed(Math.random() < 0.5 ? ball.dx : -ball.dx);
    }
    requestAnimationFrame(() => gameLoop(board));
  }
}

export default function controller() {
  gameUI();
  const canvas = document.querySelector(".canvas");
  const ctx = canvas.getContext("2d"); // Gives me canvas workspace

  const scoreCanvas = document.querySelector(".scoreCanvas"); // For ui element that don't change often
  const scoreCtx = scoreCanvas.getContext("2d");

  const player1Paddle = new Paddle(40, canvas.height / 2 - 50, 10, 100);
  const player1 = new Player("player", "Player 1", player1Paddle, 0);

  const player2Paddle = new Paddle(
    canvas.width - 50,
    canvas.height / 2 - 50,
    10,
    100,
  );
  const player2 = new Player("player", "Player 2", player2Paddle, 0);
  const players = [player1, player2];

  const ball = new Ball(2, 2, canvas.width / 2, canvas.height / 2, 10);

  const board = new Board(canvas, ctx, players, 0, ball);

  player1.paddle.draw(ctx);
  player2.paddle.draw(ctx);
  updateScore(board, player1.score, player2.score);

  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const text = "Press ENTER to start";
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  ctx.fillText(text, x, y);

  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      startCountdown(board);
    }
  });
}

function startCountdown(board) {
  let countdown = 3;
  const ctx = board.ctx;
  const canvas = board.canvas;
  const player1 = board.players[0];
  const player2 = board.players[1];
  const ball = board.ball;

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
        clearInterval(countdownInterval);
        isPaused = false;
        requestAnimationFrame(() => board.updateRounds(), gameLoop(board));
      }
    }, 1000);
  }, 100);
}
