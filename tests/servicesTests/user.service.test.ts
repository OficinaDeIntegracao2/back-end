import "reflect-metadata";
import { UserService } from "../../src/service/user.service";
import { DatabaseConfiguration } from "../../src/configuration/database/database.configuration";
import { PrismaClient, Role } from "@prisma/client";
import { CreatedUserDto } from "../../src/service/dto/created-user.dto";
import { UserOutputDto } from "../../src/service/dto/user-output.dto";
import bcrypt from "bcrypt";
import UserAlreadyExistsError from "../../src/service/error/user-already-exists.error";
import ProfessorNotFoundError from "../../src/service/error/professor-not-found.error";
import VolunteerNotFoundError from "../../src/service/error/volunteer-not-found.error";

jest.mock("bcrypt");
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

let prismaMock: jest.Mocked<PrismaClient>;
let databaseConfigMock: jest.Mocked<DatabaseConfiguration>;
let userService: UserService;

jest.mock("../../src/util/calculate-subject-total-hours.util", () => ({
  calculateSubjectTotalHours: jest.fn(() => 40),
}));

describe("UserService", () => {
  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
      professor: {
        findUnique: jest.fn(),
      },
      volunteer: {
        findUnique: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>;

    databaseConfigMock = {
      getClient: jest.fn(() => prismaMock),
    } as unknown as jest.Mocked<DatabaseConfiguration>;

    userService = new UserService(databaseConfigMock);

    jest.clearAllMocks();
  });

  describe("createProfessor", () => {
    it("must create a professor", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prismaMock.user.create as jest.Mock).mockResolvedValue({
        id: "user-id",
        name: "Douglas",
        email: "douglas@email.com",
        password: "hashedPassword",
        role: Role.PROFESSOR,
        createdAt: new Date("2025-01-01"),
      });

      const result = await userService.createProfessor(
        "Douglas",
        "douglas@email.com",
        "123456"
      );

      expect(result.error).toBeUndefined();
      expect(result.professor).toEqual(
        new CreatedUserDto(
          "user-id",
          "Douglas",
          "douglas@email.com",
          Role.PROFESSOR,
          new Date("2025-01-01")
        )
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "douglas@email.com" },
      });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith("123456", 8);
      expect(prismaMock.user.create).toHaveBeenCalled();
    });

    it("must return an error that the user already exists", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
        id: "user-id",
        email: "douglas@email.com",
      });

      const result = await userService.createProfessor(
        "Douglas",
        "douglas@email.com",
        "123456"
      );

      expect(result.professor).toBeUndefined();
      expect(result.error).toBeInstanceOf(UserAlreadyExistsError);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "douglas@email.com" },
      });

      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe("createVolunteer", () => {
    it("must create a volunteer", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prismaMock.user.create as jest.Mock).mockResolvedValue({
        id: "user-id",
        name: "Matheus",
        email: "matheus@email.com",
        password: "hashedPassword",
        role: Role.VOLUNTEER,
        createdAt: new Date("2025-01-01"),
      });

      const result = await userService.createVolunteer(
        "Matheus",
        "matheus@email.com",
        "123456"
      );

      expect(result.error).toBeUndefined();
      expect(result.volunteer).toEqual(
        new CreatedUserDto(
          "user-id",
          "Matheus",
          "matheus@email.com",
          Role.VOLUNTEER,
          new Date("2025-01-01")
        )
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "matheus@email.com" },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith("123456", 8);
      expect(prismaMock.user.create).toHaveBeenCalled();
    });

    it("must return an error that the user already exists", async () => {
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
        id: "user-id",
        name: "Matheus",
        email: "matheus@email.com",
        password: "hashedPassword",
        role: Role.VOLUNTEER,
        createdAt: new Date("2025-01-01"),
      });

      const result = await userService.createVolunteer(
        "Matheus",
        "matheus@email.com",
        "123456"
      );

      expect(result.volunteer).toBeUndefined();
      expect(result.error).toBeInstanceOf(UserAlreadyExistsError);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "matheus@email.com" },
      });

      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe("getUserByRole", () => {
    it("must return users of the specified role", async () => {
      const mockedUsers = [
        {
          id: "user-1",
          name: "Douglas",
          email: "douglas@email.com",
          password: "hashedPassword",
          role: Role.PROFESSOR,
          createdAt: new Date("2025-01-01"),
        },
        {
          id: "user-2",
          name: "Matheus",
          email: "matheus@email.com",
          password: "hashedPassword",
          role: Role.PROFESSOR,
          createdAt: new Date("2025-01-01"),
        },
      ];

      (prismaMock.user.findMany as jest.Mock).mockResolvedValue(mockedUsers);

      const result = await userService.getUsersByRole("professors");

      expect(result.error).toBeUndefined();
      expect(result.users).toEqual([
        new CreatedUserDto(
          "user-1",
          "Douglas",
          "douglas@email.com",
          Role.PROFESSOR,
          new Date("2025-01-01")
        ),
        new CreatedUserDto(
          "user-2",
          "Matheus",
          "matheus@email.com",
          Role.PROFESSOR,
          new Date("2025-01-01")
        ),
      ]);

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: { role: Role.PROFESSOR },
      });
    });

    it("must return a message when there are no users with the specified role", async () => {
      (prismaMock.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await userService.getUsersByRole("volunteers");

      expect(result.error).toBeUndefined();
      expect(result.users).toBe("No users found with role VOLUNTEER");

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: { role: Role.VOLUNTEER },
      });
    });
  });

  describe("getProfessorById", () => {
    it("must return a professor", async () => {
      const mockProfessor = {
        id: "prof-id",
        user: {
          id: "user-id",
          name: "Douglas",
          email: "doug@email.com",
          role: Role.PROFESSOR,
          createdAt: new Date("2025-01-01"),
        },
        subjects: [
          {
            id: "subj-1",
            name: "Matemática",
            description: "Matemática",
            startTime: "08:00",
            endTime: "10:00",
            durationWeeks: "10",
            weekdays: "Segunda",
          },
          {
            id: "subj-2",
            name: "Física",
            description: "Física",
            startTime: "09:00",
            endTime: "11:00",
            durationWeeks: "10",
            weekdays: "Segunda",
          },
        ],
      };

      (prismaMock.professor.findUnique as jest.Mock).mockResolvedValue(
        mockProfessor
      );

      const result = await userService.getProfessorById("prof-id");

      expect(result.error).toBeUndefined();
      expect(result.professor).toEqual(
        new UserOutputDto(
          "user-id",
          "Douglas",
          "doug@email.com",
          Role.PROFESSOR,
          new Date("2025-01-01"),
          [
            {
              id: "subj-1",
              name: "Matemática",
              description: "Matemática",
              totalHours: 40,
            },
            {
              id: "subj-2",
              name: "Física",
              description: "Física",
              totalHours: 40,
            },
          ]
        )
      );

      expect(prismaMock.professor.findUnique).toHaveBeenCalledWith({
        where: { id: "prof-id" },
        include: {
          user: true,
          subjects: {
            select: {
              id: true,
              name: true,
              description: true,
              startTime: true,
              endTime: true,
              durationWeeks: true,
              weekdays: true,
            },
          },
        },
      });
    });

    it("must return an error that the professor was not found", async () => {
      (prismaMock.professor.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userService.getProfessorById("prof-id");

      expect(result.professor).toBeUndefined();
      expect(result.error).toBeInstanceOf(ProfessorNotFoundError);
      expect((result.error as ProfessorNotFoundError).message).toContain(
        "prof-id"
      );

      expect(prismaMock.professor.findUnique).toHaveBeenCalledWith({
        where: { id: "prof-id" },
        include: {
          user: true,
          subjects: {
            select: {
              id: true,
              name: true,
              description: true,
              startTime: true,
              endTime: true,
              durationWeeks: true,
              weekdays: true,
            },
          },
        },
      });
    });
  });

  describe("getVolunteerById", () => {
    it("must return a volunteer", async () => {
      const mockVolunteer = {
        id: "user-id",
        user: {
          id: "user-id",
          name: "Matheus",
          email: "matheus@email.com",
          role: Role.VOLUNTEER,
          createdAt: new Date("2025-01-01"),
        },
        subjects: [
          {
            subject: {
              id: "subj-1",
              name: "Matemática",
              description: "Matemática",
              totalHours: 40,
            },
          },
          {
            subject: {
              id: "subj-2",
              name: "História",
              description: "História",
              totalHours: 40,
            },
          },
        ],
      };

      (prismaMock.volunteer.findUnique as jest.Mock).mockResolvedValue(
        mockVolunteer
      );

      const result = await userService.getVolunteerById("user-id");

      expect(result.error).toBeUndefined();
      expect(result.volunteer).toEqual(
        new UserOutputDto(
          "user-id",
          "Matheus",
          "matheus@email.com",
          Role.VOLUNTEER,
          new Date("2025-01-01"),
          [
            {
              id: "subj-1",
              name: "Matemática",
              description: "Matemática",
              totalHours: 40,
            },
            {
              id: "subj-2",
              name: "História",
              description: "História",
              totalHours: 40,
            },
          ]
        )
      );

      expect(prismaMock.volunteer.findUnique).toHaveBeenCalledWith({
        where: { id: "user-id" },
        include: {
          user: true,
          subjects: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  startTime: true,
                  endTime: true,
                  durationWeeks: true,
                  weekdays: true,
                },
              },
            },
          },
        },
      });
    });

    it("must return an error that the volunteer was not found", async () => {
      (prismaMock.volunteer.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userService.getVolunteerById("user-id");

      expect(result.volunteer).toBeUndefined();
      expect(result.error).toBeInstanceOf(VolunteerNotFoundError);
      expect((result.error as VolunteerNotFoundError).message).toContain(
        "user-id"
      );

      expect(prismaMock.volunteer.findUnique).toHaveBeenCalledWith({
        where: { id: "user-id" },
        include: {
          user: true,
          subjects: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  startTime: true,
                  endTime: true,
                  durationWeeks: true,
                  weekdays: true,
                },
              },
            },
          },
        },
      });
    });
  });
});
