import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import type { Category } from './category-types.js';
import type { CategoryService } from './category-service.js';
import type { Logger } from 'winston';

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly logger: Logger,
    ) {
        this.create = this.create.bind(this);
    }
    async create(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0]?.msg));
        }

        const { name, priceConfiguration, attributes } = req.body as Category;
        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
        });

        this.logger.info('Category has been created.', {
            id: category._id,
        });

        res.status(201).json({ id: category._id });
    }
}
