import logger from "./logger.js";
import fs from "fs/promises";
import path from "path";
import keyv from "keyv";
import sharp from "sharp";
import mimeTypes from "mime-types";

const cache = new keyv();

const dataDirectory = path.join("assets", "data");
const imagesDirectory = path.join("assets", "images");

export async function getTypes() {
  const found = await cache.get("types");
  if (found) {
    logger.debug("Cache hit for types");
    return found;
  }

  try {
    const types = await fs.readdir(dataDirectory);

    await cache.set("types", types);
    logger.info("Added types to cache");

    return types;
  } catch (e) {
    logger.error(`Error reading types: ${e}`);
    throw e;
  }
}

export async function getAvailableEntities(type) {
  const found = await cache.get(`data-${type}`.toLowerCase());
  if (found) {
    logger.debug(`Cache hit for data-${type}`);
    return found;
  }

  const filePath = path.join(dataDirectory, type);
  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (e) {
    throw new Error(`Type ${type} not found`);
  }

  try {
    const entities = await fs.readdir(filePath);
    await cache.set(`data-${type}`, entities);
    logger.info(`Added ${type} to the cache`);
    return entities;
  } catch (e) {
    logger.error(`Error reading entities for ${type}: ${e}`);
    throw e;
  }
}

export async function getEntity(type, id, lang = "en") {
  const cacheId = `data-${type}-${id}-${lang}`.toLowerCase();
  const found = await cache.get(cacheId);
  if (found) {
    logger.info(`Cache hit for data-${type}-${id}-${lang}`);
    return found;
  }

  const filePath = path
    .join(dataDirectory, type, id.toLowerCase(), `${lang}.json`)
    .normalize();

  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (e) {
    let errorMessage = `Entity ${type}/${id} for language ${lang} not found`;
    const englishPath = path
      .join(dataDirectory, type, id.toLowerCase(), "en.json")
      .normalize();

    try {
      await fs.access(englishPath, fs.constants.F_OK);
      errorMessage += `, language en would exist`;
    } catch (e) {}

    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const file = await fs.readFile(filePath);
    const entity = JSON.parse(file);
    await cache.set(cacheId, entity);
    logger.info(`Added ${id} in ${lang} to the cache`);
    return entity;
  } catch (e) {
    logger.error(
      `Error reading or parsing entity ${type}/${id} for language ${lang}: ${e}`
    );
    throw e;
  }
}

export async function getAvailableImages(type, id) {
  const cacheId = `image-${type}-${id}`.toLowerCase();
  const found = await cache.get(cacheId);
  if (found) {
    logger.debug(`Cache hit for image-${type}-${id}`);
    return found;
  }

  const filePath = path.join(imagesDirectory, type, id).normalize();
  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (e) {
    throw new Error(`No images for ${type}/${id} exist`);
  }

  try {
    const images = await fs.readdir(filePath);
    await cache.set(cacheId, images);
    logger.info(`Added ${id} to the cache`);
    return images;
  } catch (e) {
    logger.error(`Error reading images for ${type}/${id}: ${e}`);
    throw e;
  }
}

export async function getImage(type, id, image) {
  const parsedPath = path.parse(image);
  const filePath = path.join(imagesDirectory, type, id, image).normalize();
  const requestedFileType =
    parsedPath.ext.length > 0 ? parsedPath.ext.substring(1) : "webp";

  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (e) {
    logger.error(`Image ${type}/${id}/${image} doesn't exist`);
    throw new Error(`Image ${type}/${id}/${image} doesn't exist`);
  }

  return {
    image: await sharp(filePath).toFormat(requestedFileType).toBuffer(),
    type: mimeTypes.lookup(requestedFileType),
  };
}
