import logger from "./logger.js";
import fs from "fs/promises";
import path from "path";
import Keyv from "keyv";
import sharp, { FormatEnum } from "sharp";
import mimeTypes from "mime-types";
import { createReadStream, ReadStream } from "fs";

const cache = new Keyv<string[]>({});

const dataDirectory = path.join("assets", "data");
const imagesDirectory = path.join("assets", "images");
const videosDirectory = path.join("assets", "videos");

export async function getTypes(): Promise<string[]> {
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

export async function getAvailableEntities(type: string): Promise<string[]> {
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

export async function getEntity(
  type: string,
  id: string,
  lang = "en"
): Promise<Record<string, any>> {
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
    } catch (e) {
      errorMessage += `, language en does not exist`;
    }

    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const file = await fs.readFile(filePath);
    const entity = JSON.parse(file.toString());
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

export async function getAvailableImages(
  type: string,
  id: string
): Promise<string[]> {
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

export async function getImage(
  type: string,
  id: string,
  image: string
): Promise<{ image: Buffer; type: string }> {
  const parsedPath = path.parse(image);
  const filePath = path.join(imagesDirectory, type, id, image).normalize();
  const requestedFileType: string =
    parsedPath.ext.length > 0 ? parsedPath.ext.substring(1) : "webp";
  const fileType = requestedFileType as keyof FormatEnum;

  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (e) {
    logger.error(`Image ${type}/${id}/${image} doesn't exist`);
    throw new Error(`Image ${type}/${id}/${image} doesn't exist`);
  }

  return {
    image: await sharp(filePath).toFormat(fileType).toBuffer(),
    type: mimeTypes.lookup(requestedFileType) || "plain/text",
  };
}

export async function getAvailableVideos(
  type: string,
  id: string
): Promise<string[]> {
  const cacheId = `video-${type}-${id}`.toLowerCase();
  const found = await cache.get(cacheId);

  if (found) {
    logger.debug(`Cache hit for video-${type}-${id}`);
    return found;
  }

  const filePath = path.join(videosDirectory, type, id).normalize();
  try {
    const videos = await fs.readdir(filePath);
    await cache.set(cacheId, videos);
    logger.info(`Added ${id} to the cache`);
    return videos;
  } catch (e) {
    logger.error(`Error reading videos for ${type}/${id}: ${e}`);
    throw e;
  }
}

export async function getVideo(
  type: string,
  id: string,
  video: string
): Promise<{ stream: ReadStream; headers: { "Content-Type": string } }> {
  const parsedPath = path.parse(video);
  const filePath = path.join(videosDirectory, type, id, video).normalize();
  const requestedFileType =
    parsedPath.ext.length > 0 ? parsedPath.ext.substring(1) : "gif";
  const headers = {
    "Content-Type": mimeTypes.lookup(requestedFileType) || "",
  };

  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (e) {
    logger.error(`Video ${type}/${id}/${video} doesn't exist`);
    throw new Error(`Video ${type}/${id}/${video} doesn't exist`);
  }

  return {
    stream: await createReadStream(filePath),
    headers,
  };
}
