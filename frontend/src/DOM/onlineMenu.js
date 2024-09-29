import createElement from "./helpers/create";
import removeChildren from "./helpers/removeChildren";
import controllerMultiplayer from "../modules/multiplayer";
import joinGameDialog from "./helpers/dialog";
import gameUI from "./gameUI";
import showToast from "./helpers/showToast";

const content = document.querySelector("#content");

export default function localMenu() {
  removeChildren(content);
  const onlineMenuContainer = createElement(content, "div", "onlineMenu");

  const dialog = joinGameDialog();

  const name = createElement(onlineMenuContainer, "h1", "localHeader");
  name.textContent = "Local Game";

  const buttonContainer = createElement(
    onlineMenuContainer,
    "div",
    "buttonContainer",
  );

  const createGameButton = createElement(
    buttonContainer,
    "button",
    "createGameButton",
    "Create Game",
  );

  createGameButton.addEventListener("click", async () => {
    try {
      const response = await controllerMultiplayer();
      if (!response.ok) {
        showToast("Try again", true);
      }
    } catch (error) {
      showToast("An error occurred", true);
    }
  });

  const joinGame = createElement(
    buttonContainer,
    "button",
    "joinGameButton",
    "Join Game",
  );

  joinGame.addEventListener("click", () => {
    dialog.showModal();
  });
}
