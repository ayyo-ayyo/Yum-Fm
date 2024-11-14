// __tests__/restaurantMenuItemsRouter.test.js
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

describe('Restaurant Menu Items Router', () => {
    test('GET /api/menuItems - should fetch all restaurant menu items', async () => {
        const response = await request(app).get('/api/menuItems');
        console.log(response.body);
        expect(response.status).toBe(200); // Output menuItems
    });
});
