/* eslint-disable no-param-reassign */
export default function paddleController(player1, player2) {
  document.addEventListener("keydown", (e) => {
    if (e.key === "w") {
      player1.paddle.direction = -1;
    } else if (e.key === "s") {
      player1.paddle.direction = 1;
    }
    if (player2) {
      if (e.key === "ArrowUp") {
        player2.paddle.direction = -1;
      } else if (e.key === "ArrowDown") {
        player2.paddle.direction = 1;
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "s") {
      player1.paddle.direction = 0;
    }
    if (player2) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        player2.paddle.direction = 0;
      }
    }
  });
}
