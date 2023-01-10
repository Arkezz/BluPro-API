const {
  getTypes,
  getAvailableEntities,
  getEntity,
  getAvailableImages,
  getImage,
} = require("../modules/filesystem");

class GameController {
  static async getTypes(ctx) {
    try {
      ctx.body = await getTypes();
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        error: error.message,
      };
    }
  }

  static async getEntities(ctx) {
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

  static async getEntity(ctx) {
    const { type, id } = ctx.params;
    const { lang } = ctx.query;

    try {
      ctx.body = await getEntity(type, id, lang);
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        error: error.message,
        availableEntities: await getAvailableEntities(type),
      };
    }
  }

  static async getAllEntities(ctx) {
    const { type } = ctx.params;
    const { lang, ...params } = ctx.query;

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
        }),
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

  static async getImages(ctx) {
    const { type, id } = ctx.params;

    try {
      ctx.body = await getAvailableImages(type, id);
    } catch (error) {
      ctx.status = 404;
      ctx.body = { error: error.message };
    }
  }

  static async getImage(ctx) {
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
}

module.exports = GameController;
