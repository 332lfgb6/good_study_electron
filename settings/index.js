const { getCurrentWindow } = require("@electron/remote");

const $ = (selector) => {
  return document.getElementById(selector);
};

$("save").addEventListener("click", () => {
  getCurrentWindow().close();
});
