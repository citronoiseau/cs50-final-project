import removeChildren from "./helpers/removeChildren";
import createWaitDialog from "./helpers/waitingDialog";
import createReturnButton from "./helpers/returnButton";
import createElement from "./helpers/create";
import showToast from "./helpers/showToast";

const content = document.querySelector("#content");

export default function gameUI(gameId, socket) {
  removeChildren(content);
  const gameContainer = createElement(content, "div", "gameContainer");

  const canvasContainer = createElement(
    gameContainer,
    "div",
    "canvasContainer",
  );

  const canvas = document.createElement("canvas");
  canvas.classList.add("canvas");
  canvasContainer.appendChild(canvas);
  canvas.width = 800;
  canvas.height = 400;

  const scoreCanvas = document.createElement("canvas");
  scoreCanvas.classList.add("scoreCanvas");
  gameContainer.appendChild(scoreCanvas);
  scoreCanvas.width = 800;
  scoreCanvas.height = 100;

  // eslint-disable-next-line no-unused-vars
  const dialog = createWaitDialog(gameId);

  const buttonContainer = createElement(
    gameContainer,
    "div",
    "buttonContainer",
  );
  const returnButton = createReturnButton(buttonContainer);

  returnButton.addEventListener("click", () => {
    if (socket) {
      socket.emit("leaveGame", () => {
        showToast("You disconnected from the game");
        socket.disconnect();
      });

      setTimeout(() => socket.disconnect(), 100);
    }
  });

  window.addEventListener("beforeunload", () => {
    if (socket) {
      socket.emit("leaveGame", () => {
        showToast("You disconnected from the game");
        socket.disconnect();
      });

      setTimeout(() => socket.disconnect(), 100);
    }
  });
}
