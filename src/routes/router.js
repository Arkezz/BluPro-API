const Router = require("koa-router");
const GameController = require("../controllers/maincontroller");
const router = new Router();

router.get("/", GameController.getTypes);
router.get("/:type", GameController.getEntities);
router.get("/:type/all", GameController.getAllEntities);
router.get("/:type/:id", GameController.getEntity);
router.get("/:type/:id/list", GameController.getImages);
router.get("/:type/:id/:imageType", GameController.getImage);

module.exports = router;
