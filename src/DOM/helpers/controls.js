import createElement from "./create";
import wKey from "../../images/letter-w.png";
import sKey from "../../images/letter-s.png";
import uparrowKey from "../../images/arrow-up.png";
import downarrowKey from "../../images/arrow-down.png";

export default function createControls(parent) {
  const controlsContainer = createElement(parent, "div", "controlsContainer");

  const controlHeader = createElement(
    controlsContainer,
    "div",
    "controlsHeader",
    "Controls",
  );

  const controls = createElement(controlsContainer, "div", "controls");

  const wsContainer = createElement(controls, "div", "wsContainer");

  const wsButtons = createElement(wsContainer, "div", "wsButtons");
  const wButtonContainer = createElement(
    wsButtons,
    "div",
    "buttonImageContainer",
  );
  const wButton = createElement(wButtonContainer, "img", "buttonImage");
  wButton.src = wKey;

  const sButtonContainer = createElement(
    wsButtons,
    "div",
    "buttonImageContainer",
  );
  const sButton = createElement(sButtonContainer, "img", "buttonImage");
  sButton.src = sKey;

  const wsButtonsText = createElement(
    wsContainer,
    "div",
    "buttonsTextContainer",
  );
  const text1 = createElement(
    wsButtonsText,
    "div",
    "buttonText",
    "for local left paddle",
  );
  const text2 = createElement(
    wsButtonsText,
    "div",
    "buttonText",
    "for online left and right paddles",
  );

  const arrowContainer = createElement(controls, "div", "arrowContainer");

  const arrowButtons = createElement(arrowContainer, "div", "arrowButtons");
  const uparrowButtonsContainer = createElement(
    arrowButtons,
    "div",
    "buttonImageContainer",
  );
  uparrowButtonsContainer.classList.add("arrowImageContainer");
  const uparrowButton = createElement(
    uparrowButtonsContainer,
    "img",
    "buttonImage",
  );
  uparrowButton.src = uparrowKey;
  uparrowButton.classList.add("arrowImage");

  const downarrowButtonContainer = createElement(
    arrowButtons,
    "div",
    "buttonImageContainer",
  );
  downarrowButtonContainer.classList.add("arrowImageContainer");
  const downarrowButton = createElement(
    downarrowButtonContainer,
    "img",
    "buttonImage",
  );
  downarrowButton.src = downarrowKey;
  downarrowButton.classList.add("arrowImage");

  const arrowsButtonsText = createElement(
    arrowContainer,
    "div",
    "buttonsTextContainer",
  );
  const text3 = createElement(
    arrowsButtonsText,
    "div",
    "buttonText",
    "for local right paddle",
  );
}
