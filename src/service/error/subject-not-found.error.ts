export default class SubjectNotFoundError extends Error {
  constructor(id: string) {
    super(`${SubjectNotFoundError.name}: subject with id '${id}' not found`);
  }
}