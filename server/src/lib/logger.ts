import pino from "pino";
import type { Config } from "../config";

export type Logger = pino.Logger;

export function createLogger(config: Config): Logger {
  return pino({
    level: config.LOG_LEVEL,
    transport:
      config.NODE_ENV === "development"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
  });
}
