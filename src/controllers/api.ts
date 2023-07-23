import { Context } from "koa";
import * as filesystem from "../modules/filesystem.js";

const APIController = {
  async getTypes(ctx: Context): Promise<void> {
    ctx.body = await filesystem.getTypes();
  },

  async getEntities(ctx: Context): Promise<void> {
    const type: string = ctx.params.type;
    ctx.body = await filesystem.getAvailableEntities(type);
  },

  async getEntity(ctx: Context): Promise<void> {
    const { type, id }: { type: string; id: string } = ctx.params;
    const lang = ctx.query.lang as string;
    ctx.body = await filesystem.getEntity(type, id, lang);
  },
  
  async getAllEntities(ctx: Context): Promise<void> {
    const type: string = ctx.params.type;
    const lang: string = ctx.query.lang as string;
    const { ...params } = ctx.query;

    const entities = await filesystem.getAvailableEntities(type);
    if (entities.length === 0)
      ctx.throw(404, `No entities found for the specified type: ${type}`);

    const entityObjects = await Promise.all(
      entities.map(async (id) => {
        return await filesystem.getEntity(type, id, lang);
      })
    );

    const filteredEntities = entityObjects.filter((entity) => {
      return Object.entries(params).every(([key, value]) => {
        return entity[key] === value;
      });
    });

    ctx.body = filteredEntities;
  },

  async getImages(ctx: Context): Promise<void> {
    const { type, id }: { type: string; id: string } = ctx.params;
    ctx.body = await filesystem.getAvailableImages(type, id);
  },

  async getImage(ctx: Context): Promise<void> {
    const {
      type,
      id,
      imageType,
    }: { type: string; id: string; imageType: string } = ctx.params;
    const image = await filesystem.getImage(type, id, imageType);

    ctx.body = image.image;
    ctx.type = image.type;
  },

  async getVideos(ctx: Context): Promise<void> {
    const { type, id }: { type: string; id: string } = ctx.params;
    ctx.body = await filesystem.getAvailableVideos(type, id);
  },

  async getVideo(ctx: Context): Promise<void> {
    const {
      type,
      id,
      videoType,
    }: { type: string; id: string; videoType: string } = ctx.params;
    const video = await filesystem.getVideo(type, id, videoType);

    ctx.body = video.stream;
    ctx.type = video.headers["Content-Type"];
  },
};

export default APIController;
