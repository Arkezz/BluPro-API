import {
  getTypes,
  getAvailableEntities,
  getEntity,
  getAvailableImages,
  getImage,
  getAvailableVideos,
  getVideo,
} from "../modules/filesystem.js";

import { Context } from "koa";

class GameController {
  static async getTypes(ctx: Context): Promise<void> {
    try {
      ctx.body = await getTypes();
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: error.message,
      };
    }
  }

  static async getEntities(ctx: Context): Promise<void> {
    const { type } = ctx.params;

    try {
      ctx.body = await getAvailableEntities(type);
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        error: error.message,
        availableTypes: await getTypes(),
      };
    }
  }

  static async getEntity(ctx: Context): Promise<void> {
    const { type, id } = ctx.params;
    const lang = ctx.query.lang as string;

    try {
      ctx.body = await getEntity(type, id, lang);
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        error: error.message,
      };
    }
  }

  static async getAllEntities(ctx: Context): Promise<void> {
    const { type } = ctx.params;
    const lang = ctx.query.lang as string;
    //const { ...params } = ctx.query;

    try {
      const entities = await getAvailableEntities(type);
      if (!entities) ctx.throw(404, "No entities found");

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
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }

  static async getImages(ctx: Context): Promise<void> {
    const { type, id } = ctx.params;

    try {
      ctx.body = await getAvailableImages(type, id);
    } catch (error) {
      ctx.status = 404;
      ctx.body = { error: error.message };
    }
  }

  static async getImage(ctx: Context): Promise<void> {
    const { type, id, imageType } = ctx.params;

    try {
      const image = await getImage(type, id, imageType);

      ctx.body = image.image;
      ctx.type = image.type;
    } catch (error) {
      ctx.status = 404;
      try {
        const availableImages = await getAvailableImages(type, id);
        ctx.body = { error: error.message, availableImages };
      } catch (e) {
        ctx.body = { error: error.message };
      }
    }
  }

  static async getVideos(ctx: Context): Promise<void> {
    const { type, id } = ctx.params;

    try {
      ctx.body = await getAvailableVideos(type, id);
    } catch (error) {
      ctx.status = 404;
      ctx.body = { error: error.message };
    }
  }

  static async getVideo(ctx: Context): Promise<void> {
    const { type, id, videoType } = ctx.params;

    try {
      const video = await getVideo(type, id, videoType);

      ctx.body = video.stream;
      ctx.type = "gif";
    } catch (error) {
      ctx.body = { error: error.message };
    }
  }
}

export default GameController;
