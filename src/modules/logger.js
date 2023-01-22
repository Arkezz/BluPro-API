import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      //Make the timestamp human readable only show the date and time
      timestamp: "YYYY-MM-DD HH:mm:ss",
      translateTime: true,
      ignore: "pid,hostname",
    },
  },
});

export default logger;
