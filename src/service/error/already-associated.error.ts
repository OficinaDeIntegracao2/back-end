export default class AlreadyAssociatedError extends Error {
  constructor(context: string,volunteerId: string, subjectId: string) {
    const entity = context == 'VOLUNTEER' ? `volunteer` : 'student';
    super(`${AlreadyAssociatedError.name}: ${entity} ${volunteerId} already associated with subject ${subjectId}`);
  }
}