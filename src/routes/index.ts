import Router, { RouterContext } from "koa-router";
import { default as API } from "../controllers/api.js";

const router: Router = new Router();

router.get("/", async (ctx: RouterContext) => {
  await API.getTypes(ctx);
});

router.get("/:type", async (ctx: RouterContext) => {
  await API.getEntities(ctx);
});

router.get("/:type/all", async (ctx: RouterContext) => {
  await API.getAllEntities(ctx);
});

router.get("/:type/:id", async (ctx: RouterContext) => {
  await API.getEntity(ctx);
});

router.get("/:type/:id/list", async (ctx: RouterContext) => {
  await API.getImages(ctx);
});

router.get("/:type/:id/list/:imageType", async (ctx: RouterContext) => {
  await API.getImage(ctx);
});

router.get("/:type/:id/media", async (ctx: RouterContext) => {
  await API.getVideos(ctx);
});

router.get("/:type/:id/media/:videoType", async (ctx: RouterContext) => {
  await API.getVideo(ctx);
});

export default router;
