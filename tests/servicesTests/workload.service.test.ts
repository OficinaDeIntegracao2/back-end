import "reflect-metadata";
import WorkloadService from "../../src/service/workload.service";
import StudentNotFoundError from "../../src/service/error/student-not-found.error";
import SubjectNotFoundError from "../../src/service/error/subject-not-found.error";
import SubjectNotScheduledError from "../../src/service/error/subject-not-scheduled.error";

jest.mock("../../src/util/date.util", () => ({
  normalizeToBrazilNoon: jest.fn((d) => d),
}));

describe("WorkloadService", () => {
  let service: WorkloadService;
  const prismaMock = {
    student: {
      findUnique: jest.fn(),
    },
    subject: {
      findUnique: jest.fn(),
    },
    hourLog: {
      create: jest.fn(),
    },
  };

  const mockDbConfig = {
    getClient: () => prismaMock,
  };

  beforeEach(() => {
    service = new WorkloadService(mockDbConfig as any);
    jest.clearAllMocks();
  });

  const userId = "user1";
  const subjectId = "subject1";
  const email = "teste@email.com";
  const attendedAt = new Date("2025-07-01T10:00:00Z");

  it("must create an hourLog", async () => {
    prismaMock.student.findUnique.mockResolvedValue({ id: "stu-1" });
    prismaMock.subject.findUnique.mockResolvedValue({
      id: subjectId,
      weekdays: "MON, TUE",
    });
    prismaMock.hourLog.create.mockResolvedValue({ id: "hl-1" });

    const result = await service.createHourLog(userId, subjectId, email, attendedAt);

    expect(result.hourLog).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(prismaMock.hourLog.create).toHaveBeenCalled();
  });

  it("must return an error that the student was not found", async () => {
    prismaMock.student.findUnique.mockResolvedValue(null);

    const result = await service.createHourLog(userId, subjectId, email, attendedAt);

    expect(result.error).toBeInstanceOf(StudentNotFoundError);
  });

  it("must return an error that the subject was not found", async () => {
    prismaMock.student.findUnique.mockResolvedValue({ id: "stu-1" });
    prismaMock.subject.findUnique.mockResolvedValue(null);

    const result = await service.createHourLog(userId, subjectId, email, attendedAt);

    expect(result.error).toBeInstanceOf(SubjectNotFoundError);
  });
});
