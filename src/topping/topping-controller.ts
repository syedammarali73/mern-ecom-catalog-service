import type { NextFunction, Request, Response } from 'express';
import type { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import type { FileStorage } from '../common/types/storage.js';
import type { CreateRequestBody, Topping } from './topping-types.js';
import type { ToppingService } from './topping-service.js';
import type { Logger } from 'winston';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';

export class ToppingController {
    constructor(
        private storage: FileStorage,
        private toppingService: ToppingService,
        private logger: Logger,
    ) {}

    create = async (
        req: Request<object, object, CreateRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0]?.msg as string));
        }

        const image = req.files!.image as UploadedFile;
        const fileUuid = uuidv4();

        await this.storage.upload({
            filename: fileUuid,
            fileData: Buffer.from(image.data.buffer),
        });

        const { name, price, tenantId } = req.body;

        const toppingData: Topping = {
            name,
            price,
            tenantId,
            image: fileUuid,
        };

        const savedTopping = await this.toppingService.create(toppingData);

        this.logger.info(`A topping is created.`, { _id: savedTopping?._id });

        res.json({ id: savedTopping._id });
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        res.json({ message: 'working' });
    };
}
