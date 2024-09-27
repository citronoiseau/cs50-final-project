export default function displayWinner(winner, players) {
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
    const winningPlayer = players.find((player) => player.name === winner);
    scoreCtx.fillText(
      `${winner} won with score ${winningPlayer.score}`,
      centerX,
      centerY,
    );
  }
}
