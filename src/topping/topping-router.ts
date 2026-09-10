import express from 'express';
import { asyncWrapper } from '../common/utils/wrapper.js';
import { ToppingController } from './topping-controller.js';
import authenticate from '../common/middlewares/authenticate.js';
import { canAccess } from '../common/middlewares/canAccess.js';
import { Roles } from '../common/constants/index.js';
import { S3Storage } from '../common/services/S3Storage.js';
import { ToppingService } from './topping-service.js';
import logger from '../config/logger.js';
import fileUpload from 'express-fileupload';
import createHttpError from 'http-errors';
import {
    createToppingValidator,
    listToppingValidator,
} from './topping-validation.js';

const router = express.Router();

const toppingService = new ToppingService();
const toppingController = new ToppingController(
    new S3Storage(),
    toppingService,
    logger,
);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),

    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, 'File size exceeds the limit');
            next(error);
        },
    }),
    createToppingValidator,
    asyncWrapper(toppingController.create),
);

router.get('/', listToppingValidator, asyncWrapper(toppingController.list));

export default router;
