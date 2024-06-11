import { Context, Next } from "koa";
import logger from "./logger.js";

interface ErrorResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  stack?: string;
}


// Base custom error class
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

// Specific error classes
export class FileNotFoundError extends CustomError {
  constructor(data?: unknown) {
    super(404, 'File not found', data);
  }
}

export class ReadError extends CustomError {
  constructor(data?: unknown) {
    super(500, 'Error reading file', data);
  }
}

// Update the error handler to handle specific errors
const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    let status = 500;
    let message = "Internal Server Error";
    let data;

    if (error instanceof CustomError) {
      status = error.status;
      data = error.data;
    }

    if (error instanceof FileNotFoundError) {
      message = error.message;
    } else if (error instanceof ReadError) {
      message = error.message;
    }

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

export default errorHandler;
