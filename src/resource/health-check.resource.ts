import { HttpStatus } from "@common/http-status.common";
import { Request, Response } from "express";

export default class HealthCheckResource {
  getStatus = (request: Request, response: Response): Response => {
    return response.status(HttpStatus.OK).send("OK");
  };
}