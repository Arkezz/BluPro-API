import logger from "./modules/logger.js";
import Koa, { Context, Next } from "koa";
import { koaBody } from "koa-body";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import compress from "koa-compress";
import "dotenv/config";

import router from "./routes/index.js";
import { errorHandler } from "./modules/errorHandler.js";

const app = new Koa<{}, Context>();

// Logger middleware
app.use(async (ctx: Context, next: Next) => {
  logger.info(`[${ctx.method}] ${ctx.url}`);
  await next();
});

// Error handling middleware
app.use(errorHandler);

app.use(helmet());
app.use(cors());
app.use(compress());
app.use(koaBody());

app.use(router.routes());

export default app;
