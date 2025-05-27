export default class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`${UserAlreadyExistsError.name}: user with email '${email}' already exists`);
  }
}