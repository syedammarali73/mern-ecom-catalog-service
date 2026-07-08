import express from 'express';
import { CategoryController } from './category-controller.js';
import categoryValidator from './category-validator.js';

const router = express.Router();

const categoryController = new CategoryController();

router.post('/', categoryValidator, categoryController.create);

export default router;
