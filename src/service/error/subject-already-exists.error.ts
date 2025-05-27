export default class SubjectAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`${SubjectAlreadyExistsError.name}: subject with name '${name}' already exists`);
  }
}