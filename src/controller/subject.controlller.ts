import { HttpStatus } from "@common/http-status.common";
import { SubjectService } from "@service/subject.service";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  createSubject = async (request: Request, response: Response): Promise<Response> => {
    const { professorId } = request.params
    const { name, description, weekdays, startTime, endTime, totalHours, durationWeeks } = request.body;
    const { subject, error } = await this.subjectService.createSubject(
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
}