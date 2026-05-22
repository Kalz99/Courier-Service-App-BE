import type { Request, Response, NextFunction } from "express";

export const catchAsync = <TReq extends Request = Request>(
    fn: (req: TReq, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req as TReq, res, next).catch(next);
    };
};
