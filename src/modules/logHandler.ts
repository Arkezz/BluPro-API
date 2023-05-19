import { Context, Next } from "koa";
import logger from "./logger.js";

export default async function loggerMiddleware(ctx: Context, next: Next) {
  const { method, url, path } = ctx;
  const startTimestamp = new Date();

  await next();

  const endTimestamp = new Date();
  const responseTime = endTimestamp.getTime() - startTimestamp.getTime();
  const status = ctx.status;
  const { request, response } = ctx;

  if (status === 304) {
    logger.info(`[${method}] ${url} - ${status} cache hit`);
  } else if (path !== "/favicon.ico" && process.env.NODE_ENV !== "test") {
    logger.info(`[${method}] ${url}`);
    logger.debug(`Request Headers: ${JSON.stringify(request.headers)}`);
    logger.debug(`Response Headers: ${JSON.stringify(response.headers)}`);
    logger.debug(`Response Time: ${responseTime}ms`);
  }
}
