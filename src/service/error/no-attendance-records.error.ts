export default class NoAttendanceRecordsError extends Error {
  constructor(studentId: string, subjectId: string) {
    super(`${NoAttendanceRecordsError.name}: no attendance records found for student ${studentId} in subject ${subjectId}`);
  }
}