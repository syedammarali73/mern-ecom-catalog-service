import request from 'supertest';
import app from '../../src/app.js';
import { initDb } from '../../src/config/db.js';
import mongoose from 'mongoose';

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

describe('POST /categories', () => {
    beforeAll(async () => {
        await initDb();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            // AAA
            // Act
            const response = await request(app)
                .post('/categories')
                .send(categoryData);

            // Assert
            expect(response.statusCode).toBe(201);
        });

        it('should return valid json', async () => {
            // AAA
            // Act
            const response = await request(app)
                .post('/categories')
                .send(categoryData);
            // Assert
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });

        it('should return an id of the created category', async () => {
            // Act
            const response = await request(app)
                .post('/categories')
                .send(categoryData);
            // Assert
            expect(response.body).toHaveProperty('id');
        });

        it('should return 400 if a price-type mismatch', async () => {
            // AAA
            categoryData.priceConfiguration.Size.priceType = 'bases';
            const response = await request(app)
                .post('/categories')
                .send(categoryData);

            // Assert
            expect(response.statusCode).toBe(400);
        });
    });
});
