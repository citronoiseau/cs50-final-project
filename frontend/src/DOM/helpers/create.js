export default function createElement(parent, type, newClass, text) {
  const element = document.createElement(`${type}`);
  element.classList.add(`${newClass}`);
  parent.appendChild(element);

  if (text) {
    element.textContent = text;
  }

  return element;
}
