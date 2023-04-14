import logger from "../src/modules/logger.js";
import chalk from "chalk";
import app from "../src/app.js";

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3100;
app.listen(port, () => {
  logger.info(chalk.blue(`Server listening on port ${port}`));
});

