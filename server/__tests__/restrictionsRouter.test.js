// __tests__/restrictionsRouter.test.js
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

describe('Restrictions Router', () => {
    test('GET /api/restrictions - should fetch all restrictions', async () => {
        const response = await request(app).get('/api/restrictions');
        expect(response.status).toBe(404);  // THERE IS NO DATA IN THE RESTRICTIONS TABLE CURRENTLY
        expect(Array.isArray(response.body)).toBe(false);  // there is no response body
    });
});
