import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { ZodSchema } from "zod";

interface ValidationSchemas {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

export function validate(schemas: ValidationSchemas) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query) as any;
            }
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params) as any;
            }
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Validation error";
                res.status(400).json({ message: firstError });
                return;
            }
            next(error);
        }
    };
}
