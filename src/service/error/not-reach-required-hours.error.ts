export default class StudentHasNotReachedRequiredHoursError extends Error {
  constructor(studentId: string, studentHours: string, subjectId: string, requiredHours: number) {
    super(`${StudentHasNotReachedRequiredHoursError.name}: student ${studentId} has has completed only ${studentHours} of ${requiredHours} in subject ${subjectId}`);
  }
}