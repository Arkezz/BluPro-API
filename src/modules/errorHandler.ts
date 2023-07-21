import { Context, Next } from "koa";
import logger from "./logger.js";

interface ErrorResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  stack?: string;
}

const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    const {
      status = error instanceof CustomError ? error.status : 500,
      message = "Internal Server Error",
      data,
    }: Partial<ErrorResponse> = error instanceof CustomError ? error : {};

    const errorResponse: ErrorResponse = { status, message };
    if (data !== undefined) {
      errorResponse.data = data;
    }

    if (process.env.NODE_ENV === "production") {
      logger.error(error);
    } else {
      errorResponse.stack = (error as Error).stack;
    }

    ctx.status = status;
    ctx.body = errorResponse;
  }
};

export class CustomError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default errorHandler;
