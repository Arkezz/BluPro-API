import logger from "./modules/logger.js";
import Koa from "koa";
import { koaBody } from "koa-body";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import compress from "koa-compress";

import router from "./routes/router.js";

const app = new Koa();

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

export default app;
