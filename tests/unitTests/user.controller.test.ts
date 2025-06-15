import "reflect-metadata";
import UserController from "../../src/controller/user.controller";
import { Request, Response } from "express";
import { UserService } from "../../src/service/user.service";
import { HttpStatus } from "../../src/common/http-status.common";

describe("UserController", () => {
  let mockUserService: jest.Mocked<UserService>;
  let controller: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    mockUserService = {
      createProfessor: jest.fn(),
      createVolunteer: jest.fn(),
      getUsersByRole: jest.fn(),
      getProfessorById: jest.fn(),
      getVolunteerById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    controller = new UserController(mockUserService);

    sendMock = jest.fn();
    statusMock = jest.fn(() => ({ send: sendMock })) as any;

    res = {
      status: statusMock,
    };
  });

  describe("createProfessor", () => {
    it("must create the professor and return http status 201", async () => {
      req = {
        body: { name: "Ana", email: "ana@test.com", password: "123456" },
      };

      const professor = {
        id: "1",
        name: req.body.name,
        email: req.body.email,
        role: "PROFESSOR",
        createdAt: new Date(),
      };
      mockUserService.createProfessor.mockResolvedValue({
        professor,
        error: undefined,
      });

      await controller.createProfessor(req as Request, res as Response);

      expect(mockUserService.createProfessor).toHaveBeenCalledWith(
        "Ana",
        "ana@test.com",
        "123456"
      );
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(sendMock).toHaveBeenCalledWith(professor);
    });

    it("must return http status 400", async () => {
      req = {
        body: { name: "Ana", email: "ana@test.com", password: "123456" },
      };

      const error = new Error("User already exists");
      mockUserService.createProfessor.mockResolvedValue({
        professor: undefined,
        error,
      });

      await controller.createProfessor(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(sendMock).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("createVolunteer", () => {
    it("must create the volunteer and return http status 201", async () => {
      req = {
        body: { name: "douglas", email: "doug@test.com", password: "123456" },
      };

      const volunteer = {
        id: "1",
        name: "douglas",
        email: "doug@test.com",
        role: "VOLUNTEER",
        createdAt: new Date(),
      };
      mockUserService.createVolunteer.mockResolvedValue({
        volunteer,
        error: undefined,
      });

      await controller.createVolunteer(req as Request, res as Response);

      expect(mockUserService.createVolunteer).toHaveBeenCalledWith(
        "douglas",
        "doug@test.com",
        "123456"
      );
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(sendMock).toHaveBeenCalledWith(volunteer);
    });

    it("must return http status 400", async () => {
      req = {
        body: { name: "Ana", email: "ana@test.com", password: "123456" },
      };

      const error = new Error("User already exists");
      mockUserService.createVolunteer.mockResolvedValue({
        volunteer: undefined,
        error,
      });

      await controller.createVolunteer(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(sendMock).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("getUsersByRole", () => {
    it("must return all users by a role", async () => {
      req = { params: { role: "PROFESSOR" } };

      const users = [
        { id: "1", name: "Mateus", email: "mat@test.com", role: "PROFESSOR", createdAt: new Date() },
        { id: "2", name: "Jose", email: "jose@test.com", role: "PROFESSOR", createdAt: new Date() },
      ];
      mockUserService.getUsersByRole.mockResolvedValue({
        users,
        error: undefined,
      });

      await controller.getUsersByRole(req as Request, res as Response);

      expect(mockUserService.getUsersByRole).toHaveBeenCalledWith("PROFESSOR");
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(sendMock).toHaveBeenCalledWith({ users });
    });

    it("must return http status 400", async () => {
      req = { params: { role: "PROFESSOR" } };

      const error = new Error("Users not found");
      mockUserService.getUsersByRole.mockResolvedValue({
        users: undefined,
        error,
      });

      await controller.getUsersByRole(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(sendMock).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("getProfessorById", () => {
    it("must return a professor", async () => {
      req = { params: { professorId: "1" } };

      const professor = {
        id: "1",
        name: "Mateus",
        email: "mat@test.com",
        role: "PROFESSOR",
        createdAt: new Date(),
        subjects: [
          {
            id: "1",
            name: "Matemática",
            description: "Matemática",
            totalHours: 20,
          },
        ],
      };
      mockUserService.getProfessorById.mockResolvedValue({
        professor,
        error: undefined,
      });

      await controller.getProfessorById(req as Request, res as Response);

      expect(mockUserService.getProfessorById).toHaveBeenCalledWith("1");
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(sendMock).toHaveBeenCalledWith({ professor });
    });

    it("must return http status 400", async () => {
      req = { params: { professorId: "1" } };

      const error = new Error("Professor not found");
      mockUserService.getProfessorById.mockResolvedValue({
        professor: undefined,
        error,
      });

      await controller.getProfessorById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(sendMock).toHaveBeenCalledWith({ error: error.message });
    });
  });

    describe("getVolunteerById", () => {
    it("must return a professor", async () => {
      req = { params: { volunteerId: "1" } };

      const volunteer = {
        id: "1",
        name: "Arissa",
        email: "ari@test.com",
        role: "VOLUNTEER",
        createdAt: new Date(),
        subjects: [
          {
            id: "1",
            name: "Matemática",
            description: "Matemática",
            totalHours: 20,
          },
        ],
      };
      mockUserService.getVolunteerById.mockResolvedValue({
        volunteer,
        error: undefined,
      });

      await controller.getVolunteerById(req as Request, res as Response);

      expect(mockUserService.getVolunteerById).toHaveBeenCalledWith("1");
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(sendMock).toHaveBeenCalledWith({ volunteer });
    });

    it("must return http status 400", async () => {
      req = { params: { getVolunteerById: "1" } };

      const error = new Error("Volunteer not found");
      mockUserService.getVolunteerById.mockResolvedValue({
        volunteer: undefined,
        error,
      });

      await controller.getVolunteerById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(sendMock).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
