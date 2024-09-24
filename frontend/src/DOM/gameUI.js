const content = document.querySelector("#content");

export default function gameUI() {
  const canvas = document.createElement("canvas");
  canvas.classList.add("canvas");
  content.appendChild(canvas);
  canvas.width = 800;
  canvas.height = 400;
}
