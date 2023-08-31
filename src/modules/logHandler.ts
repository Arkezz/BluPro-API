import { Context, Next } from "koa";
import logger from "./logger.js";

export default async function loggerMiddleware(ctx: Context, next: Next) {
  const startTimestamp = new Date();

  await next();

  const endTimestamp = new Date();
  const responseTime = endTimestamp.getTime() - startTimestamp.getTime();
  const { method, url, fresh, status, response, query, body, header, ip } = ctx;

  if (process.env.NODE_ENV !== "test") {
    if (fresh) logger.info(`[${method}] ${url} - ${status} cache hit`);
    logger.info(`[${method}] ${url}`);
    logger.debug(`Request Headers: ${JSON.stringify(header)}`);
    logger.debug(`Request Query: ${JSON.stringify(query)}`);
    logger.debug(`Request Body: ${JSON.stringify(body)})`);
    logger.debug(`Response Headers: ${JSON.stringify(response.headers)}`);
    logger.debug(`Response Time: ${responseTime}ms`);
    logger.debug(`User Agent: ${header["user-agent"]}`);
    logger.debug(`IP Address: ${ip}`);
  }
}
