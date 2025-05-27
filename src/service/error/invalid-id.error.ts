export default class InvalidIdError extends Error {
  constructor(environmentVaribale: string) {
    super(`${InvalidIdError.name}: id '${environmentVaribale}' is not valid`);
  }
}