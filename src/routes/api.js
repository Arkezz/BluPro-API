const Router = require("koa-router");

const {
  getTypes,
  getAvailableEntities,
  getEntity,
  getAvailableImages,
  getImage,
} = require("../modules/filesystem");

const errors = {
  notFound: {
    status: 404,
    message: "Not found",
  },
};

const router = new Router();

router.get("/", async (ctx) => {
  try {
    const types = await getTypes();
    ctx.body = types;
  } catch (error) {
    ctx.status = errors.notFound.status;
    ctx.body = {
      error: errors.notFound.message,
    };
  }
});

router.get("/:type", async (ctx) => {
  try {
    const { type } = ctx.params;
    const entities = await getAvailableEntities(type);
    ctx.body = entities;
  } catch (error) {
    ctx.status = errors.notFound.status;
    const availableTypes = await getTypes();
    ctx.body = {
      error: errors.notFound.message,
      availableTypes,
    };
  }
});

router.get("/:type/all", async (ctx) => {
  try {
    const { lang, ...params } = ctx.query;
    const { type } = ctx.params;
    const entities = await getAvailableEntities(type);

    if (!entities) return;

    const entityObjects = await Promise.all(
      entities.map(async (id) => {
        try {
          return await getEntity(type, id, lang);
        } catch (e) {
          return null;
        }
      })
    );

    ctx.body = entityObjects.filter((entity) => {
      if (!entity) return;

      for (const [key, value] of Object.entries(params)) {
        if (!entity[key] || entity[key] !== value) return false;
      }
      return true;
    });
  } catch (e) {
    ctx.status = errors.notFound.status;
    ctx.body = { error: errors.notFound.message };
  }
});

router.get("/:type/:id", async (ctx) => {
  try {
    const { lang } = ctx.query;
    const { type, id } = ctx.params;

    ctx.body = await getEntity(type, id, lang);
  } catch (e) {
    ctx.status = errors.notFound.status;
    ctx.body = { error: errors.notFound.message };
  }
});

router.get("/:type/:id/list", async (ctx) => {
  try {
    const { type, id } = ctx.params;

    ctx.body = await getAvailableImages(type, id);
  } catch (e) {
    ctx.status = errors.notFound.status;
    ctx.body = { error: errors.notFound.message };
  }
});

router.get("/:type/:id/:imageType", async (ctx) => {
  const { type, id, imageType } = ctx.params;

  try {
    const image = await getImage(type, id, imageType);

    ctx.body = image.image;
    ctx.type = image.type;
  } catch (e) {
    ctx.status = errors.notFound.status;
    try {
      const av = await getAvailableImages(type, id);
      ctx.body = { error: errors.notFound.message, availableImages: av };
    } catch (e) {
      ctx.body = { error: errors.notFound.message };
    }
  }
});

module.exports = router;
