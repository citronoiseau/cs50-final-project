import Board from "../classes/board";
import Ball from "../classes/ball";
import Player from "../classes/player";
import Paddle from "../classes/paddle";
import gameUI from "../DOM/gameUI";

import paddleController from "../functions/paddleController";
import displayWinner from "../functions/displayWinner";
import updateScore from "../functions/updateScore";

let isPaused = true;
let lastTime;

function gameLoop(board, time) {
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

  if (!isPaused) {
    ball.draw(ctx);
    const isWin = ball.moveBall(canvas, player1, player2, delta);
    if (isWin) {
      isPaused = true;
      board.updateRounds();
      updateScore(board);
      if (board.rounds === 5) {
        let winner;
        if (player1.score > player2.score) {
          winner = player1.name;
        } else if (player1.score < player2.score) {
          winner = player2.name;
        } else {
          winner = "It's a tie!";
        }

        displayWinner(winner, board.players);
        return;
      }

      startCountdown(board);
      ball.reset(canvas);
      player1.paddle.reset(canvas);
      player2.paddle.reset(canvas);
    }
    requestAnimationFrame((newTime) => gameLoop(board, newTime));
  }
}

function startCountdown(board) {
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
        clearInterval(countdownInterval);
        isPaused = false;
        requestAnimationFrame((time) => {
          lastTime = time;
          gameLoop(board, time);
        });
      }
    }, 1000);
  }, 100);
}

export default function controller(bot = false) {
  let gameStarted = false;
  gameUI();
  const canvas = document.querySelector(".canvas");
  const ctx = canvas.getContext("2d"); // Gives me canvas workspace

  const player1Paddle = new Paddle(40, canvas.height / 2 - 50, "left", 10, 100);
  const player1 = new Player("player", "Player 1", player1Paddle, 0);

  const player2Paddle = new Paddle(
    canvas.width - 50,
    canvas.height / 2 - 50,
    "right",
    10,
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
    10,
  );

  const board = new Board(canvas, ctx, players, 0, ball, false);

  player1.paddle.draw(ctx);
  player2.paddle.draw(ctx);
  updateScore(board);

  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const text = "Press ENTER to start";
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  ctx.fillText(text, x, y);
  paddleController(player1, player2);
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !gameStarted) {
      gameStarted = true;
      startCountdown(board);
    }
  });
}
