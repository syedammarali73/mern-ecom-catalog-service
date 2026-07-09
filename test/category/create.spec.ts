import request from 'supertest';
import app from '../../src/app.js';
import { initDb } from '../../src/config/db.js';
import mongoose from 'mongoose';
import createJWKSMock from 'mock-jwks';

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
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string; // accessToken

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501');
        jwks.start();

        adminToken = jwks.token({
            sub: '1',
            role: 'admin',
        });
        await initDb();
    }, 25000);

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterEach(() => {
        jwks.stop();
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
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(categoryData);

            // Assert
            expect(response.statusCode).toBe(201);
        });

        it('should return valid json', async () => {
            // AAA
            // Act
            const response = await request(app)
                .post('/categories')
                .set('Cookie', [`accessToken=${adminToken}`])
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
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(categoryData);
            // Assert
            expect(response.body).toHaveProperty('id');
        });

        it('should return 400 if a price-type mismatch', async () => {
            // AAA
            categoryData.priceConfiguration.Size.priceType = 'bases';
            const response = await request(app)
                .post('/categories')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(categoryData);

            // Assert
            expect(response.statusCode).toBe(400);
        });
    });

    describe('When unauthenticated', () => {
        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app)
                .post('/categories')
                .set('Cookie', [`accessToken=${''}`])
                .send(categoryData);

            expect(response.statusCode).toBe(401);
        });
    });
});
