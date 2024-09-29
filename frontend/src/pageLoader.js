import startMenu from "./DOM/startMenu";
import controllerMultiplayer from "./modules/multiplayer";

export function pageLoader() {
  startMenu();
}

export function pageLoaderDeepLink(gameId) {
  controllerMultiplayer(gameId);
}
