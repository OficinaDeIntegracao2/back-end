import { HttpStatus } from "@common/http-status.common";
import ParticipantService from "@service/participant.service";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export default class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {} 

  associateVolunteer = async (request: Request, response: Response): Promise<Response> => {
      const { volunteerId } = request.body;
      const { professorId, subjectId } = request.params;
      const { error } = await this.participantService.associateVolunteer(professorId, subjectId, volunteerId);
      if (error) return response.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
      return response.status(HttpStatus.CREATED).send();
  }

}