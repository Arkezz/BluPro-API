import Router from "koa-router";
import GameController from "../controllers/classController.js";

const router = new Router();
//router.prefix("/api");

router.get("/", GameController.getTypes);
router.get("/:type", GameController.getEntities);
router.get("/:type/all", GameController.getAllEntities);
router.get("/:type/:id", GameController.getEntity);
router.get("/:type/:id/list", GameController.getImages);
router.get("/:type/:id/list/:imageType", GameController.getImage);
router.get("/:type/:id/media", GameController.getVideos);
router.get("/:type/:id/media/:videoType", GameController.getVideo);

export default router;
