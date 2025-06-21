export default class SubjectNotScheduledError extends Error {
  constructor(subjectId: string, attendedAt: Date) {
    super(
      `${SubjectNotScheduledError.name}: subject ${subjectId} is not scheduled at ${attendedAt.toISOString()}`
    );
  }
}