import "reflect-metadata";
import { SubjectController } from "../../src/controller/subject.controlller";
import { HttpStatus } from "../../src/common/http-status.common";
import { SubjectService } from "../../src/service/subject.service";
import { Request, Response } from "express";
import { SubjectOutputDto } from "../../src/service/dto/subject-output.dto";

describe("SubjectController", () => {
  let mockSubjectService: jest.Mocked<SubjectService>;
  let controller: SubjectController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    mockSubjectService = {
      create: jest.fn(),
      getAllProfessorSubjects: jest.fn(),
      getById: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    } as unknown as jest.Mocked<SubjectService>;

    controller = new SubjectController(mockSubjectService);

    sendMock = jest.fn();
    statusMock = jest.fn(() => ({ send: sendMock })) as any;

    res = {
      status: statusMock,
    };
  });

  describe("create", () => {
    it("Must create a subject", async () => {
      req = {
        params: { professorId: "1" },
        body: {
          name: "Matematica",
          description: "Matematica",
          weekdays: "Segunda",
          startTime: "17h",
          endTime: "18h",
          totalHours: 20,
          durationWeeks: "15",
        },
      };

      const subject = {
        professorId: "1",
        id: "1",
        name: "Matematica",
        description: "Matematica",
        weekdays: "Segunda",
        startTime: "17h",
        endTime: "18h",
        totalHours: 20,
        durationWeeks: "15",
      };

      mockSubjectService.create.mockResolvedValue({
        subject,
        error: undefined,
      });

      await controller.create(req as Request, res as Response);

      expect(mockSubjectService.create).toHaveBeenCalledWith(
        "1",
        "Matematica",
        "Matematica",
        "Segunda",
        "17h",
        "18h",
        20,
        "15"
      );
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(sendMock).toHaveBeenCalledWith(subject);
    });

    it("must return http status 400", async () => {
      req = {
        params: { professorId: "1" },
        body: {
          name: "Matematica",
          description: "Matematica",
          weekdays: "Segunda",
          startTime: "17h",
          endTime: "18h",
          totalHours: 20,
          durationWeeks: "15",
        },
      };

      const error = new Error("Subject not found");
      mockSubjectService.create.mockResolvedValue({
        subject: undefined,
        error,
      });

      await controller.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(sendMock).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("getAllProfessorSubjects", () => {
    it("Must get all subjects from a professor", async () => {
      req = {
        params: { professorId: "1" },
      };

      const subjects = [
        {
          professorId: "1",
          id: "1",
          name: "Matematica",
          description: "Matematica",
        },
      ];
      mockSubjectService.getAllProfessorSubjects.mockResolvedValue({
        subjects,
        error: undefined,
      });

      await controller.getAllProfessorSubjects(req as Request, res as Response);

      expect(mockSubjectService.getAllProfessorSubjects).toHaveBeenCalledWith(
        "1"
      );
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(sendMock).toHaveBeenCalledWith({ subjects });
    });
  });

  describe("getById", () => {
    it("must return a subject by it's id", async () => {
      req = { params: { professorId: "1", subjectId: "1" } };

      const subject = new SubjectOutputDto(
        "subj1",
        "Matemática",
        "Matemática básica",
        40,
        "SEGUNDA",
        "08:00",
        "10:00",
        "4",
        { id: "prof1", name: "Professor X" },
        [{ id: "vol1", name: "Voluntário Y" }]
      );

      mockSubjectService.getById.mockResolvedValue({
        subject,
        error: undefined,
      });

      await controller.getById(req as Request, res as Response);

      expect(mockSubjectService.getById).toHaveBeenCalledWith("1", "1");
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(sendMock).toHaveBeenCalledWith({ subject });
    });

    it("must return http status 400", async () => {
      req = { params: { professorId: "1", subjectId: "1" } };

      const error = new Error("Subject not found");
      mockSubjectService.getById.mockResolvedValue({
        subject: undefined,
        error,
      });

      await controller.getById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(sendMock).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("updateById", () => {
    it("must return http status 201", async () => {
      req = {
        params: { professorId: "1", subjectId: "1" },
        body: {
          name: "Matematica",
          description: "Matematica",
          weekdays: "3",
          startTime: "1",
          endTime: "1",
          totalHours: 20,
          durationWeeks: "2",
        },
      };

      mockSubjectService.updateById.mockResolvedValue({ error: undefined });

      await controller.updateById(req as Request, res as Response);

      expect(mockSubjectService.updateById).toHaveBeenCalledWith("1", "1", {
        name: "Matematica",
        description: "Matematica",
        weekdays: "3",
        startTime: "1",
        endTime: "1",
        totalHours: 20,
        durationWeeks: "2",
      });
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(sendMock).toHaveBeenCalledWith();
    });

    it("must return http status 400", async () => {
      req = {
        params: { professorId: "1", subjectId: "1" },
        body: {
          name: "Matematica",
          description: "Matematica",
          weekdays: "3",
          startTime: "1",
          endTime: "1",
          totalHours: 20,
          durationWeeks: "2",
        },
      };

      const error = new Error("Update failed");

      mockSubjectService.updateById.mockResolvedValue({ error });

      await controller.updateById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(sendMock).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("deleteById", () => {
    it("Must delete the subject", async () => {
      req = {
        params: { professorId: "1", subjectId: "1" },
      };

      mockSubjectService.deleteById.mockResolvedValue({ error: undefined });

      await controller.deleteById(req as Request, res as Response);

      expect(mockSubjectService.deleteById).toHaveBeenCalledWith("1", "1");
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(sendMock).toHaveBeenCalledWith();
    });

    it("must return http status 400", async () => {
      req = {
        params: { professorId: "1", subjectId: "1" },
      };

      const error = new Error("Subject not found");

      mockSubjectService.deleteById.mockResolvedValue({ error });

      await controller.deleteById(req as Request, res as Response);

      expect(mockSubjectService.deleteById).toHaveBeenCalledWith("1", "1");
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(sendMock).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
