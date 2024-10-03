/* eslint-disable no-unused-vars */
import createElement from "./create";
import showToast from "./showToast";

export default function createWaitDialog(gameId) {
  const menu = document.querySelector(".gameContainer");

  const dialog = createElement(menu, "dialog", "dialog");

  const idContainer = createElement(dialog, "div", "idContainer");

  const idText = createElement(idContainer, "div", "idText", "Your game id:");
  const id = createElement(idContainer, "div", "gameId", `${gameId}`);

  id.addEventListener("click", () => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}?gameId=${gameId}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        showToast(`Game url copied to clipboard: ${fullUrl}`);
      })
      .catch((error) => {
        showToast("Failed to copy text: ", error);
      });
  });
  const tooltipText = createElement(
    id,
    "span",
    "tooltiptext",
    "Left-click to copy game url",
  );

  const dialogText = createElement(
    dialog,
    "div",
    "dialogTitle",
    "Waiting for other player...",
  );

  const spinner = createElement(dialog, "div", "spinner");

  return dialog;
}
