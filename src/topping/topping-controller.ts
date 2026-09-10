import type { NextFunction, Request, Response } from 'express';

export class ToppingController {
    constructor() {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json({ message: 'working' });
        } catch (err) {
            return next(err);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json({ message: 'working' });
        } catch (err) {
            return next(err);
        }
    };
}
