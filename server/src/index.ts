import { createApp } from "./app";

const { app, config, logger } = createApp();

logger.info({ port: config.PORT, env: config.NODE_ENV }, `Server starting on port ${config.PORT}`);

export default {
  port: config.PORT,
  fetch: app.fetch,
};
