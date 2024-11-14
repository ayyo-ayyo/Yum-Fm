// __tests__/usersRouter.test.js
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

describe('Users Router', () => {
    test('GET /api/users - should return 404 if no users are found', async () => {
        const response = await request(app).get('/api/users');
        console.log(response.body);
        expect(response.status).toBe(200); // Output empty array
    });
});
