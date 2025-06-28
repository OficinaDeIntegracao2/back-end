export default class StudentNotEnrolledError extends Error {
  constructor(studentId: string, subjectId: string) {
    super(`${StudentNotEnrolledError.name}: student ${studentId} is not enrolled in subject ${subjectId}`);
  }
}