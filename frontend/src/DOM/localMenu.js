import createElement from "./helpers/create";
import removeChildren from "./helpers/removeChildren";
import controller from "../modules/controller";
import createReturnButton from "./helpers/returnButton";
import { maxRoundsDialog, getMaxRounds } from "./helpers/maxRoundsDialog";

const content = document.querySelector("#content");

export default function localMenu() {
  removeChildren(content);
  let gameMode = null;

  const localMenuContainer = createElement(content, "div", "startMenu");

  const name = createElement(localMenuContainer, "h1", "localHeader");
  name.textContent = "Local Game";

  const dialogRounds = maxRoundsDialog(localMenuContainer);

  const buttonContainer = createElement(
    localMenuContainer,
    "div",
    "buttonContainer",
  );

  const twoPlayers = createElement(
    buttonContainer,
    "button",
    "twoPlayersButton",
    "Player vs Player",
  );
  twoPlayers.addEventListener("click", () => {
    gameMode = false;
    dialogRounds.showModal();
  });

  const againstBot = createElement(
    buttonContainer,
    "button",
    "againstBotButton",
    "Player vs Bot",
  );

  againstBot.addEventListener("click", () => {
    gameMode = true;
    dialogRounds.showModal();
  });

  dialogRounds.addEventListener("close", () => {
    const rounds = getMaxRounds();

    if (dialogRounds.returnValue === "default") {
      if (gameMode === false) {
        controller(false, rounds);
      } else if (gameMode === true) {
        controller(true, rounds);
      }
    }

    gameMode = null;
  });

  const returnButton = createReturnButton(buttonContainer);
}
