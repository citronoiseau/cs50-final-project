import localMenu from "./localMenu";
import onlineMenu from "./onlineMenu";
import createElement from "./helpers/create";
import removeChildren from "./helpers/removeChildren";

const content = document.querySelector("#content");

export default function startMenu() {
  removeChildren(content);
  const startMenuContainer = createElement(content, "div", "startMenu");

  const name = createElement(startMenuContainer, "h1", "gameName");
  name.textContent = "PING PONG";

  const buttonContainer = createElement(
    startMenuContainer,
    "div",
    "buttonContainer",
  );

  const localGame = createElement(
    buttonContainer,
    "button",
    "localGameButton",
    "Local game",
  );
  localGame.addEventListener("click", () => {
    localMenu();
  });

  const onlineGame = createElement(
    buttonContainer,
    "button",
    "onlineGameButton",
    "Online game",
  );

  onlineGame.addEventListener("click", () => {
    onlineMenu();
  });
}
