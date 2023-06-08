import { Context, Next } from "koa";
import logger from "./logger.js";

export default async function loggerMiddleware(ctx: Context, next: Next) {
  const { method, url, response, query, body, header } = ctx;
  const startTimestamp = new Date();

  await next();

  const endTimestamp = new Date();
  const responseTime = endTimestamp.getTime() - startTimestamp.getTime();

  if (ctx.fresh) logger.info(`[${method}] ${url} - 304 cache hit`);
  else if (process.env.NODE_ENV !== "test") {
    logger.info(`[${method}] ${url}`);
    logger.debug(`Request Headers: ${JSON.stringify(header)}`);
    logger.debug(`Request Query: ${JSON.stringify(query)}`);
    logger.debug(`Request Body: ${JSON.stringify(body)})`);
    logger.debug(`Response Headers: ${JSON.stringify(response.headers)}`);
    logger.debug(`Response Time: ${responseTime}ms`);
    logger.debug(`User Agent: ${header["user-agent"]}`);
    logger.debug(`IP Address: ${ctx.ip}`);
  }
}
