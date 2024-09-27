import controller from "./modules/controller";
import controllerMultiplayer from "./modules/multiplayer";

export function pageLoader() {
  controllerMultiplayer();
}

export function pageLoaderDeepLink(gameId) {
  controllerMultiplayer(gameId);
}
