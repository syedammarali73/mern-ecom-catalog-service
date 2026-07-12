import request from 'supertest';
import app from '../../src/app.js';
import { initDb } from '../../src/config/db.js';
import mongoose from 'mongoose';
import CategoryModel from '../../src/category/category-model.js';

const categoryData = {
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
        {
            name: 'Spiciness',
            widgetType: 'radio',
            defaultValue: 'Medium',
            availableOptions: ['Less', 'Medium', 'Hot'],
        },
    ],
};

describe('GET /categories/:categoryId', () => {
    let categoryId: string;

    beforeAll(async () => {
        await initDb();
    }, 25000);

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();

        const category = await CategoryModel.create(categoryData);
        categoryId = category._id.toString();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Given category exists', () => {
        it('should return the 200 status code', async () => {
            const response = await request(app).get(
                `/categories/${categoryId}`,
            );

            expect(response.statusCode).toBe(200);
        });

        it('should return valid json', async () => {
            const response = await request(app).get(
                `/categories/${categoryId}`,
            );

            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });

        it('should return the requested category', async () => {
            const response = await request(app).get(
                `/categories/${categoryId}`,
            );

            expect(response.body).toEqual(
                expect.objectContaining({
                    _id: categoryId,
                    name: categoryData.name,
                }),
            );
        });

        it('should return category details', async () => {
            const response = await request(app).get(
                `/categories/${categoryId}`,
            );

            expect(response.body).toEqual(
                expect.objectContaining({
                    _id: expect.any(String),
                    name: expect.any(String),
                    priceConfiguration: expect.any(Object),
                    attributes: expect.any(Array),
                }),
            );
        });

        it('should not require authentication', async () => {
            const response = await request(app).get(
                `/categories/${categoryId}`,
            );

            expect(response.statusCode).not.toBe(401);
            expect(response.statusCode).not.toBe(403);
        });
    });

    describe('Given category does not exist', () => {
        it('should return null', async () => {
            const response = await request(app).get(
                '/categories/686cf2e5b3c8ef4b2e4f9d11',
            );

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeNull();
        });
    });
});
