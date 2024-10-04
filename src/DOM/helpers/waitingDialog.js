/* eslint-disable no-unused-vars */
import createElement from "./create";
import showToast from "./showToast";
import startMenu from "../startMenu";

export default function createWaitDialog(gameId) {
  const menu = document.querySelector(".gameContainer");

  const dialog = createElement(menu, "dialog", "dialog");

  const dialogContainer = createElement(dialog, "div", "dialogContainer");

  const idContainer = createElement(dialogContainer, "div", "idContainer");

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
    dialogContainer,
    "div",
    "dialogTitle",
    "Waiting for other player...",
  );

  const spinner = createElement(dialogContainer, "div", "spinner");

  const cancelButton = createElement(
    dialogContainer,
    "button",
    "closeButton",
    "Cancel",
  );

  cancelButton.addEventListener("click", () => {
    dialog.close();
    startMenu();
    showToast("You disconnected from the game");
  });

  return dialog;
}
