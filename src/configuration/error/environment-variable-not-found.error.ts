export default class EnvironmentVariableNotFoundError extends Error {
  constructor(environmentVaribale: string) {
    super(`${EnvironmentVariableNotFoundError.name}: environment variable '${environmentVaribale}' not found`);
  }
}