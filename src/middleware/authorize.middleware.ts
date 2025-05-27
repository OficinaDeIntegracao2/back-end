import { Constant } from "@common/constant.common";
import EnvironmentConfiguration from "@configuration/environment.configuration";
import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import jwt from "jsonwebtoken";

@injectable()
export default class AuthorizeMiddleware {
  constructor(private readonly environmentConfiguration: EnvironmentConfiguration) {}

  authorize = (allowedRoles: Role[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
      const authHeader = request.headers.authorization;
      if(!authHeader || !authHeader.startsWith("Bearer ")) return response.status(401).send({ error: "Authorization header is missing" });
      const token = authHeader.split(" ")[1];
      const secret = this.environmentConfiguration.getStringValue(Constant.JWT_SECRET);
      try {
        const decoded = jwt.verify(token, secret) as { sub: string; role: Role };
        if (!allowedRoles.includes(decoded.role)) return response.status(403).send({ error: "Forbidden" });
        request.user = { id: decoded.sub, role: decoded.role };
        return next();
      } catch (error) {
        return response.status(401).send({ error: "Invalid token" });
      }
    }
  }
}