import { App } from "./app.js";
import { _config } from "./config/config.js";
import { logger } from "./utils/logger.js";


const AppInstance = new App();
const app = AppInstance.getApp();

const start = async () => {

  app.listen(_config.PORT, () => {
    logger.info(`Server is running on port ${_config.PORT}`);
  }).on("error", (error) => {
    logger.fatal(error, "Server failed to start");
    process.exit(1);
  });
};

void start();
