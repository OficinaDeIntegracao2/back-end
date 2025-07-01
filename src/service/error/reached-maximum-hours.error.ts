export default class ReachedMaximumHoursError extends Error {
  constructor(subjectId: string, studentId: string) {
    super(`${ReachedMaximumHoursError.name}: student ${studentId} has already reached the maximum hours for subject ${subjectId}`);
  }
}