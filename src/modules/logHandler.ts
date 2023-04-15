import { Context, Next } from "koa";
import logger from "./logger.js";

export default async function loggerMiddleware(ctx: Context, next: Next) {
  await next();

  const { method, url, status, path } = ctx;
  if (status === 304) {
    logger.info(`[${method}] ${url} - ${status} cache hit`);
  } else if (path !== "/favicon.ico") {
    logger.info(`[${method}] ${url}`);
  }
}
