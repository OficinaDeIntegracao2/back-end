import { HttpStatus } from "@common/http-status.common";
import { SubjectService } from "@service/subject.service";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  create = async (request: Request, response: Response): Promise<Response> => {
    const { professorId } = request.params
    const { name, description, weekdays, startTime, endTime, durationWeeks } = request.body;
    const { subject, error } = await this.subjectService.create(
      professorId,
      name,
      description,
      weekdays,
      startTime,
      endTime,
      durationWeeks
    );
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    return response.status(HttpStatus.CREATED).send(subject);
  };

  getAllProfessorSubjects = async (request: Request, response: Response): Promise<Response> => {
    const { professorId } = request.params;
    const { subjects, error } = await this.subjectService.getAllProfessorSubjects(professorId);
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    return response.status(HttpStatus.OK).send({subjects});
  };

  getById = async (request: Request, response: Response): Promise<Response> => {
    const { professorId, subjectId } = request.params;
    const { subject, error } = await this.subjectService.getById(professorId, subjectId);
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    return response.status(HttpStatus.OK).send({subject});
  };
  
  updateById = async (request: Request, response: Response): Promise<Response> => {
    const { professorId, subjectId } = request.params;
    const { name, description, weekdays, startTime, endTime, durationWeeks } = request.body;
    const { error } = await this.subjectService.updateById(
      subjectId,
      professorId,
      {
        name,
        description,
        weekdays,
        startTime,
        endTime,
        durationWeeks
      }
    );
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    return response.status(HttpStatus.OK).send();
  }

  deleteById = async (request: Request, response: Response): Promise<Response> => {
    const { professorId, subjectId } = request.params;
    const { error } = await this.subjectService.deleteById(subjectId, professorId);
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    return response.status(HttpStatus.OK).send();
  };
}