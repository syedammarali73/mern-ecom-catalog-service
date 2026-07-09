import { body } from 'express-validator';

export default [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required.')
        .bail()
        .isString()
        .withMessage('Category name must be a string'),

    body('priceConfiguration')
        .exists()
        .withMessage('Price Configuration is required.')
        .bail()
        .isObject()
        .withMessage('Price configuration must be an object.'),

    body('priceConfiguration.*.priceType')
        .exists()
        .withMessage('Price type is required.')
        .bail()
        .isIn(['base', 'additional'])
        .withMessage('Price type must be either "base" or "additional".'),

    body('priceConfiguration.*.availableOptions')
        .exists()
        .withMessage('Available options are required.')
        .bail()
        .isArray({ min: 1 })
        .withMessage('Available options must be a non-empty array.'),

    body('attributes')
        .exists()
        .withMessage('Attributes are required.')
        .bail()
        .isArray()
        .withMessage('Attributes must be an array.'),

    body('attributes.*.name')
        .exists({ checkFalsy: true })
        .withMessage('Attribute name is required.')
        .bail()
        .isString()
        .withMessage('Attribute name must be a string.'),

    body('attributes.*.widgetType')
        .exists()
        .withMessage('Widget type is required.')
        .bail()
        .isIn(['switch', 'radio'])
        .withMessage('Widget type must be either "switch" or "radio".'),

    body('attributes.*.defaultValue')
        .exists()
        .withMessage('Default value is required.'),

    body('attributes.*.availableOptions')
        .exists()
        .withMessage('Available options are required.')
        .bail()
        .isArray({ min: 1 })
        .withMessage('Available options must be a non-empty array.'),
];
