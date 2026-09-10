import express from 'express';
import { asyncWrapper } from '../common/utils/wrapper.js';
import { ToppingController } from './topping-controller.js';
import authenticate from '../common/middlewares/authenticate.js';
import { canAccess } from '../common/middlewares/canAccess.js';
import { Roles } from '../common/constants/index.js';

const router = express.Router();

const toppingController = new ToppingController();

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    asyncWrapper(toppingController.create),
);
router.get('/', asyncWrapper(toppingController.list));

export default router;
