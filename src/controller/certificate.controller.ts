import { HttpStatus } from "@common/http-status.common";
import CertificateService from "@service/certificate/certificate.service";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export default class CertificateController {
  constructor(
    private readonly certificateService: CertificateService
  ) {}

  createCertificate = async (request: Request, response: Response): Promise<Response> => {
    const { professorId, subjectId } = request.params;
    const { studentId } = request.body;
    const { certificate, error } = await this.certificateService.createCertificate({
      subjectId,
      studentId,
      professorId
    });
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    return response.status(HttpStatus.CREATED).send({ certificate });
  }
}