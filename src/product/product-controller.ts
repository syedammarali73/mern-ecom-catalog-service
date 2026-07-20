import type { NextFunction, Response } from 'express';
import type { Request } from 'express-jwt';
import type { ProductService } from './product-service.js';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import type { FileStorage } from '../common/types/storage.js';
import { v4 as uuidv4 } from 'uuid';
import type { UploadedFile } from 'express-fileupload';
import type { Product } from './product-model.js';
import type { Logger } from 'winston';

export class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
        private logger: Logger,
    ) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0]?.msg as string));
        }

        const image = req.files!.image as UploadedFile;
        const imageName = uuidv4();

        await this.storage.upload({
            filename: imageName,
            fileData: Buffer.from(image.data.buffer),
        });

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublish,
        } = req.body;

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            tenantId,
            categoryId,
            isPublish,
            image: imageName,
        };

        const newProduct = await this.productService.createProduct(
            product as Product,
        );

        this.logger.info(`A product is created.`, { _id: newProduct?._id });

        res.json({ id: newProduct._id });
    };
}
