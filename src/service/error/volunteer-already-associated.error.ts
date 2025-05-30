export default class VolunteerAlreadyAssociatedError extends Error {
  constructor(volunteerId: string, subjectId: string) {
    super(`${VolunteerAlreadyAssociatedError.name}: volunteer ${volunteerId} already associated with subject ${subjectId}`);
  }
}