export default class ProfessorNotFoundError extends Error {
  constructor(id: string) {
    super(`${ProfessorNotFoundError.name}: professor with id ${id} not found`);
  }
}