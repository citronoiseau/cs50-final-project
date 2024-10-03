export default function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
