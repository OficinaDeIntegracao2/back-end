export default class SubjectNotFoundError extends Error {
  constructor(id: string) {
    super(`${SubjectNotFoundError.name}: subject ${id} not found`);
  }
}