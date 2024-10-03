export default function updateScore(board) {
  const scoreCanvas = document.querySelector(".scoreCanvas"); // For ui element that don't change often
  if (scoreCanvas) {
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
}
