import express from "express";
import Router from "./router";
import { injectable } from "tsyringe";
import CertificateController from "@controller/certificate.controller";
import AuthorizeMiddleware from "../middleware/authorize.middleware";
import EnsureProfessorSubjectOrVolunteerAssociatedMiddleware from "../middleware/ensure-professor-subject-or-volunteer-associated";

@injectable()
export default class CertificateRouter implements Router {

  constructor(
    private readonly certificateController: CertificateController,
    private readonly authorizationMiddleware: AuthorizeMiddleware,
    private readonly ensureProfessorSubjectOrVolunteerAssociatedMiddleware: EnsureProfessorSubjectOrVolunteerAssociatedMiddleware,
  ) {}
  get(): express.Router {
    const router = express.Router({ mergeParams: true });
    router.post("/", this.authorizationMiddleware.authorize(["ADMIN", "PROFESSOR"]), this.ensureProfessorSubjectOrVolunteerAssociatedMiddleware.validate(), this.certificateController.createCertificate);
    return router;
  }
  path(): string {
    return "/api/professors/:professorId/subjects/:subjectId/certificates";
  }

}