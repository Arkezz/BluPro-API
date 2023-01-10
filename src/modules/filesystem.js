const logger = require("./logger");
const fs = require("fs");
const path = require("path");
const keyv = require("keyv");
const sharp = require("sharp");
const { promisify } = require("util");
const mimeTypes = require("mime-types");

const cache = new keyv();

const dataDirectory = path.join("assets", "data");
const imagesDirectory = path.join("assets", "images");

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

async function getTypes() {
  const found = await cache.get("types");
  if (found) {
    logger.debug("Cache hit for types");
    return found;
  }

  const types = await readdir(dataDirectory);

  await cache.set("types", types);
  logger.info("Added types to cache");

  return types;
}

async function getAvailableEntities(type) {
  const found = await cache.get(`data-${type}`.toLowerCase());
  if (found) {
    logger.debug(`Cache hit for data-${type}`);
    return found;
  }

  const filePath = path.join(dataDirectory, type);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Type ${type} not found`);
  }

  const entities = await readdir(filePath);
  await cache.set(`data-${type}`, entities);
  logger.info(`Added ${type} to the cache`);
  return entities;
}

async function getEntity(type, id, lang = "en") {
  const cacheId = `data-${type}-${id}-${lang}`.toLowerCase();
  const found = await cache.get(cacheId);
  if (found) {
    logger.debug(`Cache hit for data-${type}-${id}-${lang}`);
    return found;
  }

  const filePath = path
    .join(dataDirectory, type, id.toLowerCase(), `${lang}.json`)
    .normalize();

  const exists = fs.existsSync(filePath);
  if (!exists) {
    let errorMessage = `Entity ${type}/${id} for language ${lang} not found`;
    const englishPath = path
      .join(dataDirectory, type, id.toLowerCase(), "en.json")
      .normalize();

    const englishExists = fs.existsSync(englishPath);
    if (englishExists) errorMessage += `, language en would exist`;

    logger.warn(errorMessage);
  }

  const file = await readFile(filePath);
  try {
    const entity = JSON.parse(file.toString("utf-8"));
    await cache.set(cacheId, entity);
    logger.info(`Added ${id} in ${lang} to the cache`);
    return entity;
  } catch (e) {
    logger.error(
      `Error in JSON formatting of Entity ${type}/${id} for language ${lang}`
    );
  }
}

async function getAvailableImages(type, id) {
  const cacheId = `image-${type}-${id}`.toLowerCase();
  const found = await cache.get(cacheId);
  if (found) {
    logger.debug(`Cache hit for image-${type}-${id}`);
    return found;
  }

  const filePath = path.join(imagesDirectory, type, id).normalize();
  if (!fs.existsSync(filePath)) {
    throw new Error(`No images for ${type}/${id} exist`);
  }

  const images = await readdir(filePath);
  await cache.set(cacheId, images);
  logger.info(`Added ${id} to the cache`);
  return images;
}

async function getImage(type, id, image) {
  const parsedPath = path.parse(image);
  const filePath = path.join(imagesDirectory, type, id, image).normalize();
  const requestedFileType =
    parsedPath.ext.length > 0 ? parsedPath.ext.substring(1) : "webp";

  if (!fs.existsSync(filePath)) {
    throw new Error(`Image ${type}/${id}/${image} doesn't exist`);
  }

  return {
    image: await sharp(filePath).toFormat(requestedFileType).toBuffer(),
    type: mimeTypes.lookup(requestedFileType),
  };
}

module.exports = {
  getTypes,
  getAvailableEntities,
  getEntity,
  getAvailableImages,
  getImage,
};
