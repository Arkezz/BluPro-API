import { Context, Next } from "koa";
import logger from "./logger.js";

interface ErrorResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  stack?: string;
}

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    const {
      status = 500,
      message = "Internal Server Error",
      data = undefined,
    } = error instanceof Error ? { message: error.message } : error;

    const errorResponse: ErrorResponse = { status, message };
    if (data) {
      errorResponse.data = data;
    }

    if (process.env.NODE_ENV === "production") {
      // Log the error in a centralized logging service
      logger.error(error);
    } else {
      // Include the error stack in the error response in non-production environments
      errorResponse.stack = error.stack;
    }

    ctx.status = status;
    ctx.body = errorResponse;
  }
};
