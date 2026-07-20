import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import { ProductController } from './product-controller.js';
import { asyncWrapper } from '../common/utils/wrapper.js';
import authenticate from '../common/middlewares/authenticate.js';
import { canAccess } from '../common/middlewares/canAccess.js';
import { Roles } from '../common/constants/index.js';
import createProductValidator from './create-product-validator.js';
import { ProductService } from './product-service.js';
import fileUpload from 'express-fileupload';
import { S3Storage } from '../common/services/S3Storage.js';
import createHttpError from 'http-errors';
import logger from '../config/logger.js';


const router = express.Router();

const productService = new ProductService();
const s3Storage = new S3Storage();
const productController = new ProductController(
    productService,
    s3Storage,
    logger,
);

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req: Request, res: Response, next: NextFunction) => {
            const error = createHttpError(400, 'File size exceeds the limit.');
            next(error);
        },
    }),
    createProductValidator,
    asyncWrapper(productController.create),
);


export default router;
