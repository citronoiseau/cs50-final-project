import startMenu from "./DOM/startMenu";
import controllerMultiplayer from "./modules/multiplayer";
import showToast from "./DOM/helpers/showToast";

export function pageLoader() {
  startMenu();
}

export async function pageLoaderDeepLink(gameId) {
  try {
    const response = await controllerMultiplayer(gameId);
    if (!response.ok) {
      showToast(
        "Failed to join the game. Please check the game ID and try again.",
        true,
      );
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      pageLoader();
    }
  } catch (error) {
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
    showToast("An error occurred", true);
    pageLoader();
  }
}
