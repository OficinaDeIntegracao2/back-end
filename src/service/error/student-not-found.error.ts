export default class StudentNotFoundError extends Error {
  constructor(email: string) {
    super(`${StudentNotFoundError.name}: student with email ${email} not found`);
  }
}