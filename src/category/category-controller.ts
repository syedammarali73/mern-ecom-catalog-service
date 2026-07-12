import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import type { Category, PriceConfiguration } from './category-types.js';
import type { CategoryService } from './category-service.js';
import type { Logger } from 'winston';

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly logger: Logger,
    ) {
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getOne = this.getOne.bind(this);
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

    async update(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0]?.msg));
        }

        const categoryId = req.params.id;
        const updateData = req.body as Partial<Category>;

        const existingCategory = await this.categoryService.getOne(
            categoryId as string,
        );

        if (!existingCategory) {
            return next(createHttpError(404, 'Category not found'));
        }

        if (updateData.priceConfiguration) {
            const existingConfig =
                existingCategory.priceConfiguration instanceof Map
                    ? Object.fromEntries(existingCategory.priceConfiguration)
                    : existingCategory.priceConfiguration;

            const mergedConfig: PriceConfiguration = {
                ...existingConfig,
                ...updateData.priceConfiguration,
            };

            updateData.priceConfiguration = mergedConfig;
        }

        const updateCategory = await this.categoryService.update(
            categoryId as string,
            updateData,
        );

        this.logger.info(`Updated category`, { id: categoryId });

        res.json({
            id: updateCategory?._id,
        });
    }

    async getAll(req: Request, res: Response) {
        const categories = await this.categoryService.getAll();
        this.logger.info(`Getting categories list`);
        res.json(categories);
    }

    async getOne(req: Request, res: Response) {
        const { categoryId } = req.params;
        const category = await this.categoryService.getOne(
            categoryId as string,
        );

        this.logger.info(`Getting categories list`);
        res.json(category);
    }
}
