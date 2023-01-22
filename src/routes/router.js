import Router from "koa-router";
import GameController from "../controllers/classController.js";

const router = new Router();

router.get("/", GameController.getTypes);
router.get("/:type", GameController.getEntities);
router.get("/:type/all", GameController.getAllEntities);
router.get("/:type/:id", GameController.getEntity);
router.get("/:type/:id/list", GameController.getImages);
router.get("/:type/:id/:imageType", GameController.getImage);

export default router;
