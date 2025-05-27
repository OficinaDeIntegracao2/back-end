import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";

@injectable()
export default class EnsureSameProfessorOrAdminMiddleware {
  validate = () => {
    return (request: Request, response: Response, next: NextFunction) => {
      const user = request.user;
      const { professorId } = request.params;
      if (!user) return response.status(401).json({ error: "Unauthorized" });
      if (user.role === Role.ADMIN) return next();
      if (user.id !== professorId) return response.status(403).json({ error: "Forbidden: you are not allowed to access this resource." });
      return next();
    };
  };
}