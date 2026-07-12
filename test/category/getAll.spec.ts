import request from 'supertest';
import app from '../../src/app.js';
import { initDb } from '../../src/config/db.js';
import mongoose from 'mongoose';
import CategoryModel from '../../src/category/category-model.js';

const categoriesData = [
    {
        name: 'Pizza',
        priceConfiguration: {
            Size: {
                priceType: 'base',
                availableOptions: ['Small', 'Medium', 'Large'],
            },
            Crust: {
                priceType: 'additional',
                availableOptions: ['Thin', 'Thick'],
            },
        },
        attributes: [
            {
                name: 'isHit',
                widgetType: 'switch',
                defaultValue: 'No',
                availableOptions: ['Yes', 'No'],
            },
        ],
    },
    {
        name: 'Burger',
        priceConfiguration: {
            Size: {
                priceType: 'base',
                availableOptions: ['Single', 'Double'],
            },
            Cheese: {
                priceType: 'additional',
                availableOptions: ['Cheddar', 'Mozzarella'],
            },
        },
        attributes: [
            {
                name: 'Spiciness',
                widgetType: 'radio',
                defaultValue: 'Medium',
                availableOptions: ['Less', 'Medium', 'Hot'],
            },
        ],
    },
] as const;

describe('GET /categories', () => {
    beforeAll(async () => {
        await initDb();
    }, 25000);

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Given categories exist', () => {
        beforeEach(async () => {
            await CategoryModel.insertMany(categoriesData);
        });

        it('should return the 200 status code', async () => {
            const response = await request(app).get('/categories');

            expect(response.statusCode).toBe(200);
        });

        it('should return valid json', async () => {
            const response = await request(app).get('/categories');

            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });

        it('should return all categories', async () => {
            const response = await request(app).get('/categories');

            expect(response.body).toHaveLength(categoriesData.length);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Pizza',
                    }),
                    expect.objectContaining({
                        name: 'Burger',
                    }),
                ]),
            );
        });

        it('should return category details', async () => {
            const response = await request(app).get('/categories');

            expect(response.body[0]).toEqual(
                expect.objectContaining({
                    _id: expect.any(String),
                    name: expect.any(String),
                    priceConfiguration: expect.any(Object),
                    attributes: expect.any(Array),
                }),
            );
        });

        it('should not require authentication', async () => {
            const response = await request(app).get('/categories');

            expect(response.statusCode).not.toBe(401);
            expect(response.statusCode).not.toBe(403);
        });
    });

    describe('Given no categories exist', () => {
        it('should return an empty list', async () => {
            const response = await request(app).get('/categories');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});
