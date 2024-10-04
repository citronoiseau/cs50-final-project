import createElement from "./create";

let maxRounds = 5; // Initial value

export function setMaxRounds(value) {
  maxRounds = value;
}

export function getMaxRounds() {
  return maxRounds;
}

export function maxRoundsDialog(container) {
  const dialog = createElement(container, "dialog", "dialog");
  dialog.id = "maxRoundsDialog";

  const dialogContainer = createElement(dialog, "div", "dialogContainer");

  const closeButton = createElement(
    dialogContainer,
    "button",
    "closeButton",
    "Close",
  );

  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  // eslint-disable-next-line no-unused-vars
  const dialogTitle = createElement(
    dialogContainer,
    "div",
    "dialogTitle",
    "Choose max rounds",
  );

  const dialogForm = document.createElement("form");
  dialogForm.id = "gameRoundsForm";
  dialogForm.classList.add("dialogForm");
  dialogForm.method = "get";
  dialogContainer.appendChild(dialogForm);

  const formElement = createElement(dialogForm, "div", "formElement");

  const label = document.createElement("label");
  label.setAttribute("for", "rounds");
  label.textContent = "Max rounds";

  const input = document.createElement("input");
  input.id = "rounds";
  input.name = "rounds";
  input.type = "number";
  input.min = 3;
  input.max = 20;
  input.placeholder = "5";
  input.value = "5";
  input.required = true;

  formElement.appendChild(label);
  formElement.appendChild(input);

  const confirmIdButton = createElement(
    dialogForm,
    "button",
    "confirmRoundsButton",
    "Save",
  );
  confirmIdButton.type = "submit";

  dialogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setMaxRounds(parseInt(input.value, 10));
    dialog.returnValue = "default";
    dialog.close();
  });

  return dialog;
}
