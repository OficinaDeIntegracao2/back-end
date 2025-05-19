import { HttpStatus } from "@common/http-status.common";
import { AuthenticationService } from "@service/authentication.service";
import { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export default class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  
  login = async (request: Request, response: Response): Promise<Response> => {
    const { email, password } = request.body;
    const { user , token, error } = await this.authenticationService.authenticate(email, password);
    if (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({error: error.message});
    }
    return response.status(HttpStatus.CREATED).send({user, token});
  }
}