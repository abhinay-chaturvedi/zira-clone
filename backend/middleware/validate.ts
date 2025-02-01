import { NextFunction, Request, Response } from "express";
import { z, ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): any => {
    try {
      // console.log(req.body)
      schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ errors: e.errors });
      }
      return res.status(500).json({ error: "unexpected error" });
    }
  };
