const pino = require("pino");

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

module.exports = logger;
