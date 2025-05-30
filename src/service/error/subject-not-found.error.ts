export default class SubjectNotFoundError extends Error {
  constructor(professorId: string, subjectId: string) {
    super(`${SubjectNotFoundError.name}: professor ${professorId} does not have a subject with id ${subjectId}`);
  }
}