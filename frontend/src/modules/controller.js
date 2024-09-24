import Ball from "../classes/ball";
import Player from "../classes/player";
import Paddle from "../classes/paddle";
import gameUI from "../DOM/gameUI";

let isPaused = false;

function gameLoop(canvas, ctx, player1, player2, ball) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player1.paddle.draw(ctx);
  player2.paddle.draw(ctx);
  ball.draw(ctx);

  if (!isPaused) {
    const isWin = ball.moveBall(canvas, player1, player2);
    if (isWin) {
      isPaused = true;
      ball.reset(canvas);
      ball.setSpeed(Math.random() < 0.5 ? ball.dx : -ball.dx);

      setTimeout(() => {
        isPaused = false;
      }, 3000);
    }
  }

  requestAnimationFrame(() => gameLoop(canvas, ctx, player1, player2, ball));
}

export default function controller() {
  gameUI();
  const canvas = document.querySelector(".canvas");
  const ctx = canvas.getContext("2d"); // Gives me canvas workspace

  const player1Paddle = new Paddle(40, canvas.height / 2 - 50, 10, 100);
  const player1 = new Player("player", "Player 1", player1Paddle, 0);

  const player2Paddle = new Paddle(
    canvas.width - 50,
    canvas.height / 2 - 50,
    10,
    100,
  );
  const player2 = new Player("player", "Player 2", player2Paddle, 0);

  const ball = new Ball(2, 2, canvas.width / 2, canvas.height / 2, 10);

  gameLoop(canvas, ctx, player1, player2, ball);
}
