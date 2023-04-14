import pino from "pino";
import pinoPretty from "pino-pretty";

const logger = pino(
  {
    prettyPrint: {
      colorize: true,
      ignore: "pid,hostname",
      translateTime: true,
      levelFirst: true,
    },
  },
  pinoPretty()
);

export default logger;
