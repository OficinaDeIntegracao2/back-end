import dotenv from "dotenv";

const LOGGING_LEVELS = ["trace", "debug", "info", "warn", "error", "fatal"];

const getLoggingLevel = () => {
  dotenv.config();
  const loggingLevel = process.env.LOGGING_LEVEL as string;
  if (!LOGGING_LEVELS.includes(loggingLevel)) {
    throw new Error(`Invalid LOGGING_LEVEL: '${loggingLevel}'`);
  }
  return loggingLevel;
};

export const logger = require("pino")({
  level: getLoggingLevel(),
});