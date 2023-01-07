const logger = require("./modules/logger");
const Koa = require("koa");
const { koaBody } = require("koa-body");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const compress = require("koa-compress");
const chalk = require("chalk");

const router = require("./routes/api");

(async () => {
  const app = new Koa();
  const port = process.env.PORT || 3000;

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = error.message;
      ctx.app.emit("error", error, ctx);
    }
  });

  app.on("error", (error, ctx) => {
    logger.error(error);
  });

  app.use(helmet());
  app.use(cors());
  app.use(compress());
  app.use(koaBody());

  app.use(router.routes());

  app.listen(port, () => {
    logger.info(chalk.blue(`Server listening on port ${port}`));
  });
})();
