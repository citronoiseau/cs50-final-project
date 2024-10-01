import createElement from "./helpers/create";
import removeChildren from "./helpers/removeChildren";
import controllerMultiplayer from "../modules/multiplayer";
import joinGameDialog from "./helpers/dialog";
import showToast from "./helpers/showToast";
import createReturnButton from "./helpers/returnButton";
import { maxRoundsDialog, getMaxRounds } from "./helpers/maxRoundsDialog";

const content = document.querySelector("#content");

export default function onlineMenu() {
  removeChildren(content);
  const onlineMenuContainer = createElement(content, "div", "onlineMenu");

  const dialog = joinGameDialog();
  const dialogRounds = maxRoundsDialog(onlineMenuContainer);

  // eslint-disable-next-line no-unused-vars
  const name = createElement(
    onlineMenuContainer,
    "h1",
    "onlineHeader",
    "Online game",
  );
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
  createGameButton.addEventListener("click", () => {
    dialogRounds.showModal();
  });

  dialogRounds.addEventListener("close", async () => {
    const rounds = getMaxRounds();

    if (dialogRounds.returnValue === "default") {
      try {
        const response = await controllerMultiplayer(false, rounds);
        if (!response.ok) {
          showToast("Please try again", true);
        }
      } catch (error) {
        showToast("An error occurred", true);
      }
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

  const returnButton = createReturnButton(buttonContainer);
}
