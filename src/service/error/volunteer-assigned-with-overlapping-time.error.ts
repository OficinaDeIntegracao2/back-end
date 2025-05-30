export default class VolunteerAssignedWithOverlappingTimeError extends Error {
  constructor(volunteerId: string) {
    super(`${VolunteerAssignedWithOverlappingTimeError.name}: volunteer ${volunteerId} already assigned to subject with overlapping time on common weekdays`);
  }
}