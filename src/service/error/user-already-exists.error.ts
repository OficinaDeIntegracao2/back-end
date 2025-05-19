export default class UserAlreadyExistsError extends Error {
  constructor(environmentVaribale: string) {
    super(`${UserAlreadyExistsError.name}: user with email '${environmentVaribale}' already exists`);
  }
}