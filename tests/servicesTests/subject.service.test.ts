import "reflect-metadata";
import { SubjectService } from "../../src/service/subject.service";
import { PrismaClient } from "@prisma/client";
import { DatabaseConfiguration } from "../../src/configuration/database/database.configuration";
import SubjectAlreadyExistsError from "../../src/service/error/subject-already-exists.error";
import SubjectNotFoundError from "../../src/service/error/subject-not-found.error";

const prismaMock = {
  subject: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  hourLog: {
    findMany: jest.fn(),
  },
} as unknown as PrismaClient;

const mockDbConfig: DatabaseConfiguration = {
  getClient: () => prismaMock,
} as DatabaseConfiguration;

let service: SubjectService;

beforeEach(() => {
  service = new SubjectService(mockDbConfig);
  jest.clearAllMocks();
});

describe("SubjectService", () => {
  describe("create", () => {
    it("must create a subject", async () => {
      (prismaMock.subject.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaMock.subject.create as jest.Mock).mockResolvedValue({
        id: "1",
        name: "Matemática",
        professorId: "prof1",
        description: "Matematica basica",
      });

      const result = await service.create(
        "prof1",
        "Matemática",
        "Desc",
        "Segunda",
        "10:00",
        "12:00",
        "10"
      );

      expect(result.subject).toBeDefined();
      expect(result.subject?.name).toBe("Matemática");
    });

    it("must return an error", async () => {
      (prismaMock.subject.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
      });

      const result = await service.create(
        "prof1",
        "Matemática",
        "Desc",
        "Seg",
        "10:00",
        "12:00",
        "10"
      );

      expect(result.error).toBeInstanceOf(SubjectAlreadyExistsError);
    });
  });

  describe("getAllProfessorSubjects", () => {
    it("must return all professors subjects", async () => {
      (prismaMock.subject.findMany as jest.Mock).mockResolvedValue([
        {
          id: "1",
          name: "Matemática",
          professorId: "prof1",
          description: "Desc",
        },
      ]);

      const result = await service.getAllProfessorSubjects("prof1");

      expect(Array.isArray(result.subjects)).toBe(true);
    });

    it("must return an error that the professor doesnt have any subjects", async () => {
      (prismaMock.subject.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getAllProfessorSubjects("prof1");

      expect(result.subjects).toBe("Professor has no subjects");
    });
  });

  describe("updateById", () => {
    it("must update the subject", async () => {
      (prismaMock.subject.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
      });
      (prismaMock.subject.update as jest.Mock).mockResolvedValue({});

      const result = await service.updateById("1", "prof1", {
        name: "Matemática",
      });

      expect(result.error).toBeUndefined();
    });

    it("must return an error that the subject doesnt exist", async () => {
      (prismaMock.subject.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.updateById("1", "prof1", {
        name: "Matemática",
      });

      expect(result.error).toBeInstanceOf(SubjectNotFoundError);
    });
  });

  describe("deleteById", () => {
    it("must delete the subject", async () => {
      (prismaMock.subject.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
      });
      (prismaMock.subject.delete as jest.Mock).mockResolvedValue({});

      const result = await service.deleteById("1", "prof1");

      expect(result.error).toBeUndefined();
    });

    it("must return an error that the subject doesnt exist", async () => {
      (prismaMock.subject.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.deleteById("1", "prof1");

      expect(result.error).toBeInstanceOf(SubjectNotFoundError);
    });
  });
});
