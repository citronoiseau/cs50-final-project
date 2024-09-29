import createElement from "./helpers/create";
import removeChildren from "./helpers/removeChildren";
import controller from "../modules/controller";

const content = document.querySelector("#content");

export default function localMenu() {
  removeChildren(content);
  const localMenuContainer = createElement(content, "div", "startMenu");

  const name = createElement(localMenuContainer, "h1", "localHeader");
  name.textContent = "Local Game";

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
    controller(false);
  });

  const againstBot = createElement(
    buttonContainer,
    "button",
    "againstBotButton",
    "Player vs Bot",
  );

  againstBot.addEventListener("click", () => {
    controller(true);
  });
}
