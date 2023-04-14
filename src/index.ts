import logger from "./modules/logger.js";
import chalk from "chalk";
import app from "./app.js";

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3200;
app.listen(port, () => {
  logger.info(chalk.blue(`Server listening on port http://localhost:${port}/`));
});
