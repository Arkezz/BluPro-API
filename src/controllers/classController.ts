import { Context } from "koa";
import {
  getTypes,
  getAvailableEntities,
  getEntity,
  getAvailableImages,
  getImage,
  getAvailableVideos,
  getVideo,
} from "../modules/filesystem.js";

class GameController {
  static async getTypes(ctx: Context): Promise<void> {
    ctx.body = await getTypes();
  }

  static async getEntities(ctx: Context): Promise<void> {
    const { type } = ctx.params;
    ctx.body = await getAvailableEntities(type);
  }

  static async getEntity(ctx: Context): Promise<void> {
    const { type, id } = ctx.params;
    const lang = ctx.query.lang as string;
    ctx.body = await getEntity(type, id, lang);
  }

  static async getAllEntities(ctx: Context): Promise<void> {
    const { type } = ctx.params;
    const lang = ctx.query.lang as string;
    //const { ...params } = ctx.query;

    const entities = await getAvailableEntities(type);
    if (!entities)
      ctx.throw(404, `No entities found for the specified type: ${type}`);

    const entityObjects = await Promise.all(
      entities.map(async (id) => {
        try {
          return await getEntity(type, id, lang);
        } catch (e) {
          return null;
        }
      })
    );

    const filteredEntities = entityObjects.filter((entity) => {
      if (!entity) return false;
      return Object.entries(ctx.query).every(([key, value]) => {
        return entity[key] === value;
      });
    });

    ctx.body = filteredEntities;
  }

  static async getImages(ctx: Context): Promise<void> {
    const { type, id } = ctx.params;
    ctx.body = await getAvailableImages(type, id);
  }

  static async getImage(ctx: Context): Promise<void> {
    const { type, id, imageType } = ctx.params;
    const image = await getImage(type, id, imageType);

    ctx.body = image.image;
    ctx.type = image.type;
  }

  static async getVideos(ctx: Context): Promise<void> {
    const { type, id } = ctx.params;
    ctx.body = await getAvailableVideos(type, id);
  }

  static async getVideo(ctx: Context): Promise<void> {
    const { type, id, videoType } = ctx.params;
    const video = await getVideo(type, id, videoType);

    ctx.body = video.stream;
    ctx.type = "gif";
  }
}

export default GameController;
