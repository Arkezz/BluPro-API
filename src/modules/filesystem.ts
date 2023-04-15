import fs from "fs/promises";
import path from "path";
import sharp, { FormatEnum } from "sharp";
import mimeTypes from "mime-types";
import { createReadStream, ReadStream } from "fs";

const dataDirectory = path.join("assets", "data");
const imagesDirectory = path.join("assets", "images");
const videosDirectory = path.join("assets", "videos");

export async function getTypes(): Promise<string[]> {
  try {
    const types = await fs.readdir(dataDirectory);

    return types;
  } catch (e) {
    throw new Error(`Error reading types: ${e}`);
  }
}

export async function getAvailableEntities(type: string): Promise<string[]> {
  const filePath = path.join(dataDirectory, type);
  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (e) {
    throw new Error(`Type ${type} not found`);
  }

  try {
    const entities = await fs.readdir(filePath);

    return entities;
  } catch (e) {
    throw new Error(`Error reading entities for ${type}: ${e}`);
  }
}

export async function getEntity(
  type: string,
  id: string,
  lang = "en"
): Promise<Record<string, any>> {
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
      // Do nothing
    }

    throw new Error(errorMessage);
  }

  try {
    const file = await fs.readFile(filePath);
    const entity = JSON.parse(file.toString());

    return entity;
  } catch (e) {
    throw new Error(
      `Error reading or parsing entity ${type}/${id} for language ${lang}: ${e}`
    );
  }
}

export async function getAvailableImages(
  type: string,
  id: string
): Promise<string[]> {
  const filePath = path.join(imagesDirectory, type, id).normalize();
  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (e) {
    throw new Error(`No images for ${type}/${id} exist`);
  }

  try {
    const images = await fs.readdir(filePath);

    return images;
  } catch (e) {
    throw new Error(`Error reading images for ${type}/${id}: ${e}`);
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
    throw new Error(`Image ${image} doesnt exist for ${type}/${id}`);
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
  const filePath = path.join(videosDirectory, type, id).normalize();
  try {
    const videos = await fs.readdir(filePath);

    return videos;
  } catch (e) {
    throw new Error(`Error reading videos for ${type}/${id}: ${e}`);
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
    throw new Error(`Video ${type}/${id}/${video} doesn't exist`);
  }

  return {
    stream: await createReadStream(filePath),
    headers,
  };
}
