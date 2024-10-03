import createElement from "./create";

export default function createFooter(container) {
  const footer = createElement(container, "div", "footerContainer");

  const attributionText = createElement(
    footer,
    "div",
    "attributionText",
    "Background designed by ",
  );

  const attributionLink = document.createElement("a");
  attributionLink.textContent = "Freepik";
  attributionLink.href = "https://www.freepik.com/";
  attributionLink.target = "_blank";

  attributionText.appendChild(attributionLink);

  const text = createElement(footer, "div", "footerText", "Game created by ");

  const authorLink = document.createElement("a");
  authorLink.textContent = "Anastasiia";
  authorLink.href = "https://github.com/citronoiseau/cs50-final-project";
  authorLink.target = "_blank";

  text.appendChild(authorLink);

  const attributionText2 = createElement(
    footer,
    "div",
    "attributionText",
    "Asteroid icons created by ",
  );

  const attributionLink2 = document.createElement("a");
  attributionLink2.textContent = "Flaticon";
  attributionLink2.href = "https://www.flaticon.com/free-icons/asteroid";
  attributionLink2.target = "_blank";

  attributionText2.appendChild(attributionLink2);
}
