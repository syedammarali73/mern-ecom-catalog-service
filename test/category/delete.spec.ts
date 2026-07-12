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

describe('DELETE /categories/:categoryId', () => {
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
            const response = await request(app).delete(
                `/categories/${categoryId}`,
            );

            expect(response.statusCode).toBe(200);
        });

        it('should return valid json', async () => {
            const response = await request(app).delete(
                `/categories/${categoryId}`,
            );

            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });

        it('should return the deleted category id', async () => {
            const response = await request(app).delete(
                `/categories/${categoryId}`,
            );

            expect(response.body).toEqual({
                _id: categoryId,
            });
        });

        it('should delete the category', async () => {
            await request(app).delete(`/categories/${categoryId}`);

            const category = await CategoryModel.findById(categoryId);
            expect(category).toBeNull();
        });

        it('should not require authentication', async () => {
            const response = await request(app).delete(
                `/categories/${categoryId}`,
            );

            expect(response.statusCode).not.toBe(401);
            expect(response.statusCode).not.toBe(403);
        });
    });

    describe('Given category does not exist', () => {
        it('should return an empty object', async () => {
            const response = await request(app).delete(
                '/categories/686cf2e5b3c8ef4b2e4f9d11',
            );

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({});
        });
    });
});
