import Board from "../classes/board";
import Ball from "../classes/ball";
import Player from "../classes/player";
import Paddle from "../classes/paddle";
import gameUI from "../DOM/gameUI";

let isPaused = true;

function updateScore(board) {
  const scoreCanvas = document.querySelector(".scoreCanvas"); // For ui element that don't change often
  const scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, scoreCtx.canvas.width, scoreCtx.canvas.height);

  scoreCtx.font = "30px Arial";
  scoreCtx.textAlign = "center";

  scoreCtx.fillText(
    `${board.players[0].name}: ${board.players[0].score}`,
    scoreCtx.canvas.width / 4,
    scoreCtx.canvas.height / 2,
  );
  scoreCtx.fillText(
    `Round: ${board.rounds}`,
    (2 * scoreCtx.canvas.width) / 4,
    scoreCtx.canvas.height / 2,
  );
  scoreCtx.fillText(
    `${board.players[1].name}: ${board.players[1].score}`,
    (3 * scoreCtx.canvas.width) / 4,
    scoreCtx.canvas.height / 2,
  );
}

function displayWinner(winner) {
  const scoreCanvas = document.querySelector(".scoreCanvas");
  const scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, scoreCtx.canvas.width, scoreCtx.canvas.height);

  scoreCtx.font = "30px Arial";
  scoreCtx.textAlign = "center";
  scoreCtx.textBaseline = "middle";

  const centerX = scoreCtx.canvas.width / 2;
  const centerY = scoreCtx.canvas.height / 2;
  if (winner === "It's a tie!") {
    scoreCtx.fillText(`${winner}`, centerX, centerY);
  } else {
    scoreCtx.fillText(
      `${winner.name} won with score ${winner.score}`,
      centerX,
      centerY,
    );
  }
}

function gameLoop(board) {
  const ctx = board.ctx;
  const canvas = board.canvas;
  const player1 = board.players[0];
  const player2 = board.players[1];
  const ball = board.ball;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player1.paddle.movePaddle(canvas);
  if (player2.type === "bot") {
    // todo
  } else {
    player2.paddle.movePaddle(canvas);
  }

  player1.paddle.draw(ctx);
  player2.paddle.draw(ctx);

  if (!isPaused) {
    ball.draw(ctx);
    const isWin = ball.moveBall(canvas, player1, player2);
    if (isWin) {
      isPaused = true;
      updateScore(board);
      if (board.rounds === 5) {
        let winner;
        if (player1.score > player2.score) {
          winner = player1;
        } else if (player1.score < player2.score) {
          winner = player2;
        } else {
          winner = "It's a tie!";
        }

        displayWinner(winner);
        return;
      }

      startCountdown(board);
      ball.reset(canvas);
      player1.paddle.reset(canvas);
      player2.paddle.reset(canvas);
      ball.setSpeed(Math.random() < 0.5 ? ball.dx : -ball.dx);
    }
    requestAnimationFrame(() => gameLoop(board));
  }
}

export default function controller(bot = true) {
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

  const ball = new Ball(2, 2, canvas.width / 2, canvas.height / 2, 10);

  const board = new Board(canvas, ctx, players, 0, ball);

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

function paddleController(player1, player2) {
  document.addEventListener("keydown", (e) => {
    if (e.key === "w") {
      player1.paddle.direction = -1;
    } else if (e.key === "s") {
      player1.paddle.direction = 1;
    }

    if (e.key === "ArrowUp") {
      player2.paddle.direction = -1;
    } else if (e.key === "ArrowDown") {
      player2.paddle.direction = 1;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "s") {
      player1.paddle.direction = 0;
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      player2.paddle.direction = 0;
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
