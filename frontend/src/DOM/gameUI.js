const content = document.querySelector("#content");

export default function gameUI() {
  const gameContainer = document.createElement("div");
  gameContainer.classList.add("gameContainer");
  content.appendChild(gameContainer);

  const canvas = document.createElement("canvas");
  canvas.classList.add("canvas");
  gameContainer.appendChild(canvas);
  canvas.width = 800;
  canvas.height = 400;

  const scoreCanvas = document.createElement("canvas");
  scoreCanvas.classList.add("scoreCanvas");
  gameContainer.appendChild(scoreCanvas);
  scoreCanvas.width = 800;
  scoreCanvas.height = 100;
}
