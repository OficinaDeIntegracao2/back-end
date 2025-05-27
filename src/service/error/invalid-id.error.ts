export default class InvalidIdError extends Error {
  constructor(id: string) {
    super(`${InvalidIdError.name}: id '${id}' is not valid`);
  }
}