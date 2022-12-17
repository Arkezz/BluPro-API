const path = require("path");

export const dataDirectory = (type) =>
  path.join(__dirname, "../assets/data", type);
export const imagesDirectory = (type) =>
  path.join(__dirname, "../assets/images", type);
