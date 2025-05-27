export default class SubjectAlreadyExistsError extends Error {
  constructor(environmentVaribale: string) {
    super(`${SubjectAlreadyExistsError.name}: subject with name '${environmentVaribale}' already exists`);
  }
}