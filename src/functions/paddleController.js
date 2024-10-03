/* eslint-disable no-param-reassign */
export default function paddleController(player1, player2) {
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 87) {
      player1.paddle.direction = -1;
    } else if (e.keyCode === 83) {
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
    if (e.keyCode === 87 || e.keyCode === 83) {
      player1.paddle.direction = 0;
    }
    if (player2) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        player2.paddle.direction = 0;
      }
    }
  });
}
