import { HttpStatus } from "@common/http-status.common";
import { UserService } from "@service/user.service";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export default class UserController {
  constructor(private readonly userService: UserService) {}
  
  createProfessor = async (request: Request, response: Response): Promise<Response> => {
    const { name, email, password } = request.body;
    const { professor , error } = await this.userService.createProfessor(name, email, password);
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({error: error.message});
    return response.status(HttpStatus.CREATED).send(professor);
  }

  createVolunteer = async (request: Request, response: Response): Promise<Response> => {
    const professorId = request.user?.id
    if (!professorId) throw new Error("Unauthorized: Professor ID is required to create a volunteer.");
    const { name, email, password } = request.body;
    const { volunteer, error } = await this.userService.createVolunteer(professorId, name, email, password);
    if (error) return response.status(HttpStatus.BAD_REQUEST).send({error: error.message});
    return response.status(HttpStatus.CREATED).send(volunteer);
  }
}