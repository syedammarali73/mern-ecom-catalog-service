import request from 'supertest';
import app from '../../src/app.js';
import { initDb } from '../../src/config/db.js';
import mongoose from 'mongoose';
import createJWKSMock from 'mock-jwks';
import { Roles } from '../../src/common/constants/index.js';

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

describe('PATCH /categories/:id', () => {
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;
    let categoryId: string;

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501');
        jwks.start();

        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN,
        });

        await initDb();
    }, 25000);

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();

        const createResponse = await request(app)
            .post('/categories')
            .set('Cookie', [`accessToken=${adminToken}`])
            .send(categoryData);

        categoryId = createResponse.body.id;
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('Given all fields', () => {
        it('should return the 200 status code', async () => {
            // AAA
            // Act
            const response = await request(app)
                .patch(`/categories/${categoryId}`)
                .set('Cookie', [`accessToken=${adminToken}`])
                .send({
                    name: 'Italian Pizza',
                });

            // Assert
            expect(response.statusCode).toBe(200);
        });

        it('should return valid json', async () => {
            // AAA
            // Act
            const response = await request(app)
                .patch(`/categories/${categoryId}`)
                .set('Cookie', [`accessToken=${adminToken}`])
                .send({
                    name: 'Italian Pizza',
                });

            // Assert
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });

        it('should return an id of the updated category', async () => {
            // Act
            const response = await request(app)
                .patch(`/categories/${categoryId}`)
                .set('Cookie', [`accessToken=${adminToken}`])
                .send({
                    name: 'Italian Pizza',
                });

            // Assert
            expect(response.body).toHaveProperty('id');
        });

        it('should return 400 if a price-type mismatch', async () => {
            // AAA
            const response = await request(app)
                .patch(`/categories/${categoryId}`)
                .set('Cookie', [`accessToken=${adminToken}`])
                .send({
                    priceConfiguration: {
                        Size: {
                            priceType: 'bases',
                        },
                    },
                });

            // Assert
            expect(response.statusCode).toBe(400);
        });

        it('should return 404 if category does not exist', async () => {
            // AAA
            // Act
            const response = await request(app)
                .patch('/categories/686cf2e5b3c8ef4b2e4f9d11')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send({
                    name: 'Italian Pizza',
                });

            // Assert
            expect(response.statusCode).toBe(404);
        });
    });

    describe('When unauthenticated', () => {
        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app)
                .patch(`/categories/${categoryId}`)
                .set('Cookie', ['accessToken='])
                .send({
                    name: 'Italian Pizza',
                });

            expect(response.statusCode).toBe(401);
        });
    });

    describe('When unauthorized', () => {
        it('should return 403 if user is not admin', async () => {
            const customerToken = jwks.token({
                sub: '1',
                role: Roles.CUSTOMER,
            });

            const response = await request(app)
                .patch(`/categories/${categoryId}`)
                .set('Cookie', [`accessToken=${customerToken}`])
                .send({
                    name: 'Italian Pizza',
                });

            expect(response.statusCode).toBe(403);
        });
    });
});
