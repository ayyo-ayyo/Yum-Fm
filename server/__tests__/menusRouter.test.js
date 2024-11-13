// __tests__/menusRouter.test.js
const request = require('supertest');
const app = require('../server'); // Make sure your server.js file is correctly referenced
const mongoose = require('mongoose');
const connectDB = require('../db');


beforeAll(async () => {
    await connectDB();  // Connect to DB
});

// Close MongoDB after tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Menus Router', () => {
    test('GET /api/menus - should fetch all menus', async () => {
        const response = await request(app).get('/api/menus');
        expect(response.status).toBe(200); // Check for successful response
        expect(Array.isArray(response.body)).toBe(true); // Ensure response is an array
    });
});
