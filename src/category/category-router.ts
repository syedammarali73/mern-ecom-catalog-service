import express from 'express';
import { CategoryController } from './category-controller.js';
import categoryValidator from './category-validator.js';
import { CategoryService } from './category-service.js';
import logger from '../config/logger.js';
import { asyncWrapper } from '../common/utils/wrapper.js';
import authenticate from '../common/middlewares/authenticate.js';
import { canAccess } from '../common/middlewares/canAccess.js';
import { Roles } from '../common/constants/index.js';
import categoryUpdateValidator from './category-update-validator.js';

const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWrapper(categoryController.create),
);

router.patch(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryUpdateValidator,
    asyncWrapper(categoryController.update),
);

router.get('/', asyncWrapper(categoryController.getAll));

export default router;
