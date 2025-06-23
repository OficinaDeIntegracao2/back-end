export default class AssignedWithOverlappingTimeError extends Error {
  constructor(context: string, id: string) {
    const entity = context == 'VOLUNTEER' ? `volunteer` : 'student';
    super(`${AssignedWithOverlappingTimeError.name}: ${entity} ${id} already assigned to subject with overlapping time on common weekdays`);
  }
}