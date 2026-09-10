import { body, query } from 'express-validator';

export const createToppingValidator = [
    body('name')
        .exists()
        .withMessage('Topping name is required')
        .isString()
        .withMessage('Topping name should be a string'),
    body('price')
        .exists()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Price cannot be negative'),
    body('image').custom((value, { req }) => {
        if (!req.files?.image) throw new Error('Topping image is required');
        return true;
    }),
    body('tenantId')
        .exists()
        .withMessage('Tenant Id is required')
        .isString()
        .withMessage('Tenant Id should be a string'),
];

export const listToppingValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];
