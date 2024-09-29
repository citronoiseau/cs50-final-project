const content = document.querySelector("#content");

export default function showToast(message, alert) {
  let toast;
  toast = document.querySelector("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    content.appendChild(toast);
  }
  toast.textContent = message;
  if (alert) {
    toast.className = "toast alert show";
  } else {
    toast.className = "toast show";
  }

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.remove("alert");
  }, 3000);
}
