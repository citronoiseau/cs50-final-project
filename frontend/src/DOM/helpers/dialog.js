import controllerMultiplayer from "../../modules/multiplayer";
import createElement from "./create";
import showToast from "./showToast";

export default function joinGameDialog() {
  const menu = document.querySelector(".onlineMenu");

  const dialog = createElement(menu, "dialog", "dialog");
  dialog.id = "joinGameDialog";

  const closeButton = createElement(dialog, "button", "closeButton", "Close");

  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  // eslint-disable-next-line no-unused-vars
  const dialogTitle = createElement(
    dialog,
    "div",
    "dialogTitle",
    "Enter game id",
  );

  const dialogForm = document.createElement("form");
  dialogForm.id = "gameIdForm";
  dialogForm.method = "get";
  dialog.appendChild(dialogForm);

  const formElement = createElement(dialogForm, "div", "formElement");

  const label = document.createElement("label");
  label.setAttribute("for", "gameId");
  label.textContent = "Game id";

  const input = document.createElement("input");
  input.id = "gameId";
  input.name = "gameId";
  input.type = "text";
  input.placeholder = "aaa-aaa-aaa";
  input.required = true;

  formElement.appendChild(label);
  formElement.appendChild(input);

  const confirmIdButton = createElement(
    dialogForm,
    "button",
    "confirmIdButton",
    "Join game",
  );
  confirmIdButton.type = "submit";

  dialogForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const gameId = document.getElementById("gameId").value;
    try {
      const response = await controllerMultiplayer(gameId);
      if (!response.ok) {
        showToast("Invalid game id", true);
      }
    } catch (error) {
      showToast("An error occurred", true);
    }
  });

  return dialog;
}
