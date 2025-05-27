import { HttpStatus } from "@common/http-status.common";
import { SubjectService } from "@service/subject.service";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  create = async (request: Request, response: Response): Promise<Response> => {
    const { professorId } = request.params
    const { name, description, weekdays, startTime, endTime, totalHours, durationWeeks } = request.body;
    const { subject, error } = await this.subjectService.create(
      professorId,
      name,
      description,
      weekdays,
      startTime,
      endTime,
      totalHours,
      durationWeeks
    );
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    return response.status(HttpStatus.CREATED).send(subject);
  };

  getById = async (request: Request, response: Response): Promise<Response> => {
    const { subjectId } = request.params;
    const { subject, error } = await this.subjectService.getById(subjectId);
    if (error) return response.status(HttpStatus.NOT_FOUND).send({ error: error.message });
    return response.status(HttpStatus.OK).send(subject);
  };

  // TODO: refactor totalHours
  updateById = async (request: Request, response: Response): Promise<Response> => {
    const { subjectId } = request.params;
    const { name, description, weekdays, startTime, endTime, totalHours, durationWeeks } = request.body;
    const { error } = await this.subjectService.updateById(
      subjectId,
      {
        name,
        description,
        weekdays,
        startTime,
        endTime,
        totalHours,
        durationWeeks
      }
    );
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}