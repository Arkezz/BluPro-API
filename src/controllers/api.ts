import { Context } from "koa";
import * as filesystem from "../modules/filesystem.js";
import { CustomError } from "../modules/errorHandler.js";

const APIController = {
  async getTypes(ctx: Context): Promise<void> {
    ctx.body = await filesystem.getTypes();
  },

  async getEntities(ctx: Context): Promise<void> {
    const { type } = ctx.params;
    ctx.body = await filesystem.getAvailableEntities(type);
  },

  async getEntity(ctx: Context): Promise<void> {
    const { type, id } = ctx.params;
    const lang = ctx.query.lang as string;
    ctx.body = await filesystem.getEntity(type, id, lang);
  },

  async getAllEntities(ctx: Context): Promise<void> {
    const { type } = ctx.params;
    const lang = ctx.query.lang as string;
    const { ...params } = ctx.query;

    const entities = await filesystem.getAvailableEntities(type);
    if (!entities || entities.length === 0)
      throw new CustomError(
        404,
        `No entities found for the specified type: ${type}`
      );

    const entityObjects = await Promise.all(
      entities.map(async (id) => {
        return await filesystem.getEntity(type, id, lang);
      })
    );

    const filteredEntities = entityObjects.filter((entity) => {
      if (!entity) return false;
      return Object.entries(params).every(([key, value]) => {
        return entity[key] === value;
      });
    });

    ctx.body = filteredEntities;
  },

  async getImages(ctx: Context): Promise<void> {
    const { type, id } = ctx.params;
    ctx.body = await filesystem.getAvailableImages(type, id);
  },

  async getImage(ctx: Context): Promise<void> {
    const { type, id, imageType } = ctx.params;
    const image = await filesystem.getImage(type, id, imageType);

    ctx.body = image.image;
    ctx.type = image.type;
  },

  async getVideos(ctx: Context): Promise<void> {
    const { type, id } = ctx.params;
    ctx.body = await filesystem.getAvailableVideos(type, id);
  },

  async getVideo(ctx: Context): Promise<void> {
    const { type, id, videoType } = ctx.params;
    const video = await filesystem.getVideo(type, id, videoType);

    ctx.body = video.stream;
    ctx.type = video.headers["Content-Type"];
  },
};

export default APIController;
