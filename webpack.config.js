const { resolve } = require("path");

module.exports = {
  mode: "production",
  target: "electron-main",
  entry: "./main.js",
  output: {
    path: resolve(__dirname, "./build"),
    filename: "main.bundle.js",
  },
  node: {
    __dirname: false,
  },
};
