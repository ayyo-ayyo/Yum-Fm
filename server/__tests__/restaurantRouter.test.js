// __tests__/restaurantRouter.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const connectDB = require('../db');

// Setup MongoDB before tests
beforeAll(async () => {
    await connectDB();  // Connect to DB
});

// Close MongoDB after tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Restaurant Router', () => {
    test('GET /api/restaurants - should fetch all restaurants', async () => {
        const response = await request(app).get('/api/restaurants');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
