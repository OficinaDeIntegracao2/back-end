export default class VolunteerNotFoundError extends Error {
  constructor(id: string) {
    super(`${VolunteerNotFoundError.name}: volunteer with id ${id} not found`);
  }
}