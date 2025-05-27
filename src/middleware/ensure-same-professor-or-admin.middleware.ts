import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";

@injectable()
export default class EnsureSameProfessorOrAdminMiddleware {
  validate = () => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      const { professorId } = req.params;
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      if (user.role === Role.ADMIN) return next();
      if (user.id !== professorId) return res.status(403).json({ error: "Forbidden: you are not allowed to access this resource." });
      return next();
    };
  };
}