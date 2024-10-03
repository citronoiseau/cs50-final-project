import startMenu from "../startMenu";
import createElement from "./create";

export default function createReturnButton(container) {
  const button = createElement(
    container,
    "button",
    "returnButton",
    "Return to main menu",
  );

  button.addEventListener("click", () => {
    startMenu();
  });

  return button;
}
