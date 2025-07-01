import express from "express";
import Router from "./router";
import { injectable } from "tsyringe";
import AuthorizeMiddleware from "../middleware/authorize.middleware";
import ParticipantController from "@controller/participant.controller";
import EnsureProfessorSubjectOrVolunteerAssociatedMiddleware from "../middleware/ensure-professor-subject-or-volunteer-associated";

@injectable()
export default class ParticipantRouter implements Router {
  constructor(
    private readonly participantController: ParticipantController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
    private readonly ensureProfessorSubjectOrVolunteerAssociatedMiddleware: EnsureProfessorSubjectOrVolunteerAssociatedMiddleware,
  ) {}

  get = (): express.Router => {
    const router = express.Router({ mergeParams: true });
    router.post("/volunteers", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.ensureProfessorSubjectOrVolunteerAssociatedMiddleware.validate(), this.participantController.associateVolunteer);
    router.post("/students", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR", "VOLUNTEER"]), this.ensureProfessorSubjectOrVolunteerAssociatedMiddleware.validate(), this.participantController.associateStudent);
    return router;
  }

  path = (): string => {  
    return "/api/professors/:professorId/subjects/:subjectId/participants";
  }
}