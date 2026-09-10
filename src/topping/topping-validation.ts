import { body } from 'express-validator';

export default [
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
