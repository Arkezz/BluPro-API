const Router = require("koa-router");

const {
  getTypes,
  getAvailableEntities,
  getEntity,
  getAvailableImages,
  getImage,
} = require("../modules/filesystem");

const router = new Router();

router.get("/", async (ctx) => {
  try {
    ctx.body = await getTypes();
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: error.message,
    };
  }
});

router.get("/:type", async (ctx) => {
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
});

router.get("/:type/all", async (ctx) => {
  const { type } = ctx.params;
  const { lang, ...params } = ctx.query;

  try {
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
  } catch (error) {
    ctx.status = 404;
    ctx.body = { error: error.message };
  }
});

router.get("/:type/:id", async (ctx) => {
  const { type, id } = ctx.params;
  const { lang } = ctx.query;

  try {
    ctx.body = await getEntity(type, id, lang);
  } catch (error) {
    ctx.status = 404;
    ctx.body = { error: error.message };
  }
});

router.get("/:type/:id/list", async (ctx) => {
  const { type, id } = ctx.params;

  try {
    ctx.body = await getAvailableImages(type, id);
  } catch (error) {
    ctx.status = 404;
    ctx.body = { error: error.message };
  }
});

router.get("/:type/:id/:imageType", async (ctx) => {
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
});

module.exports = router;
