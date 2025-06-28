export default class CertificateAlreadyExistsError extends Error {
  constructor(studentId: string, subjectId: string) {
    super(`${CertificateAlreadyExistsError.name}: certificate already exists for student ${studentId} in subject ${subjectId}`);
    this.name = "CertificateAlreadyExistsError";
  }
} 