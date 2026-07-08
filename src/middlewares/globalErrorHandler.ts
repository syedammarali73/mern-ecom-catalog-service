import type { NextFunction, Request, Response } from 'express';
import type { HttpError } from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger.js';
import config from 'config';

export const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    const errorId = uuidv4();
    const statusCode = err.status || 500;

    const isProduction = config.get('server.NODE_ENV') === 'production';

    let message = isProduction ? 'Internal server error' : err.message;

    if (statusCode === 400) {
        message = err.message;
    }

    logger.error(err.message, {
        id: errorId,
        statusCode,
        error: err.stack,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json({
        errors: [
            {
                ref: errorId,
                type: err.name,
                msg: message,
                path: req.path,
                method: req.method,
                location: 'server',
                stack: isProduction ? null : err.stack,
            },
        ],
    });
};
