import { pageLoader, pageLoaderDeepLink } from "./pageLoader";

const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const gameId = getQueryParam("gameId");

if (gameId) {
  // If user joins an already created game
  pageLoaderDeepLink(gameId);
} else {
  // If user just opens the website
  pageLoader();
}
