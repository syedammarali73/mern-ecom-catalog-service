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
import type { AuthRequest } from '../common/types/index.js';
import { Roles } from '../common/constants/index.js';

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

    update = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0]?.msg as string));
        }


        const productId = req.params.productId;

        // check if tenant has access to the product
        const product = await this.productService.getProduct(String(productId))

        if (!product) {
            return next(createHttpError(404, "Product not found."))
        }

        if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
            const tenant = (req as AuthRequest).auth.tenant;

            if (product.tenantId !== String(tenant)) {
                return next(createHttpError(403, "You are not allowed to access this product"))
            }

        }


        let imageName: string | undefined;

        let oldImage: string | undefined;

        if (req.files?.image) {
            oldImage = await this.productService.getProductImage(
                productId as string,
            );

            const image = req.files.image as UploadedFile;

            imageName = uuidv4();

            await this.storage.upload({
                filename: imageName,

                fileData: Buffer.from(image.data.buffer),
            });

            await this.storage.delete(oldImage!);
        }

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublish,
        } = req.body;

        const productToUpdate = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration as string),
            attributes: JSON.parse(attributes as string),
            tenantId,
            categoryId,
            isPublish,
            image: imageName ? imageName : oldImage,
        };

        const updatedProduct = await this.productService.updateProduct(
            productId as string,
            productToUpdate as Product,
        );

        this.logger.info(`The product is updated.`, {
            _id: updatedProduct?._id,
        });

        res.json({ id: productId });
    };
}
