import { HttpStatus } from "@common/http-status.common";
import WorkloadService from "@service/workload.service";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export default class WorkloadController {
  constructor(
    private readonly workloadService: WorkloadService
  ) {}

  createHourLog = async (request: Request, response: Response) => {
    if (!request.user) return response.status(HttpStatus.UNAUTHORIZED).send({ error: "User not authenticated" });
    const { id: userId } = request.user;
    const { subjectId } = request.params;
    const { email, attendedAt } = request.body;
    const { hourLog, error } = await this.workloadService.createHourLog(
      userId,
      subjectId,
      email,
      attendedAt
    );
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    return response.status(HttpStatus.CREATED).send({hourLog});
  };

}