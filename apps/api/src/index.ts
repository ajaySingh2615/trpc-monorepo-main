import http from "node:http";
import { logger } from "@repo/logger";
import { app } from "./server";
import { env } from "./env";

async function init() {
  try {
    const server = http.createServer(app);
    const PORT = env.PORT ? +env.PORT : 8000;

    server.listen(PORT, () => {
      logger.info(`server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("failed to start server", { error });
    process.exit(1);
  }
}

init();
