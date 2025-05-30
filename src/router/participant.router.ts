import express from "express";
import Router from "./router";
import { injectable } from "tsyringe";
import AuthorizeMiddleware from "../middleware/authorize.middleware";
import EnsureSameUserOrAdminMiddleware from "../middleware/ensure-same-user-or-admin.middleware";
import ParticipantController from "@controller/participant.controller";

@injectable()
export default class ParticipantRouter implements Router {
  constructor(
    private readonly participantController: ParticipantController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
  ) {}

  get = (): express.Router => {
    const router = express.Router({ mergeParams: true });
    router.post("/volunteers", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.participantController.associateVolunteer);
    return router;
  }

  path = (): string => {  
    return "/api/professors/:professorId/subjects/:subjectId/participants";
  }
}