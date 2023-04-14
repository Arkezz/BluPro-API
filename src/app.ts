import logger from "./modules/logger.js";
import Koa from "koa";
import { Context } from "koa";
import { koaBody } from "koa-body";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import compress from "koa-compress";

import router from "./routes/index.js";

const app = new Koa<{}, Context>();

app.use(async (ctx: Context, next: () => Promise<void>) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = error.message;
    app.emit("error", error, ctx);
  }
});

app.on("error", (error: Error) => {
  logger.error(error);
});

app.use(helmet());
app.use(cors());
app.use(compress());
app.use(koaBody());

app.use(router.routes());

export default app;
