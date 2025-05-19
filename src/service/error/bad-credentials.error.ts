export default class BadCredentialsError extends Error {
  constructor() {
    super(`${BadCredentialsError.name}: invalid email or password`);
  }
}