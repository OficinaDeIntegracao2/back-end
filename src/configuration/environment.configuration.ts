import dotenv from "dotenv";
import { singleton } from "tsyringe";
import { logger } from "@util/logger.util";
import EnvironmentVariableNotFoundError from "./error/environment-variable-not-found.error";
import InvalidEnvironmentVariableTypeError from "./error/invalid-environment-variable-type.error";

@singleton()
export default class EnvironmentConfiguration {
  constructor() {
    dotenv.config();
  }

  getStringValue = (key: string): string => {
    return this.getValue(key);
  }

  private getValue = (key: string): string => {
    const value = process.env[key];
    if (!value) throw new EnvironmentVariableNotFoundError(key); 
    logger.debug(`loaded environment variable '${key}' with value '${value}'`);
    return value;
  }

  getIntValue = (key: string): number => {
    const value = this.getValue(key);
    try {
      return parseInt(value);
    } catch (error: unknown) {
      throw new InvalidEnvironmentVariableTypeError(key, value);
    }
  }
}