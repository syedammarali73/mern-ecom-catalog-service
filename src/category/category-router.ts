import express from 'express';
import { CategoryController } from './category-controller.js';
import categoryValidator from './category-validator.js';
import { CategoryService } from './category-service.js';
import logger from '../config/logger.js';
import { asyncWrapper } from '../common/utils/wrapper.js';
import authenticate from '../common/middlewares/authenticate.js';

const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    '/',
    authenticate,
    categoryValidator,
    asyncWrapper(categoryController.create),
);

export default router;
