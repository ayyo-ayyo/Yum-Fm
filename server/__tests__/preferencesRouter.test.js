// __tests__/preferencesRouter.test.js
const request = require('supertest');
const app = require('../server'); // Make sure your server.js file is correctly referenced
const mongoose = require('mongoose');
const connectDB = require('../db');
const {expect, test, beforeAll, afterAll, describe} = require('@jest/globals');

beforeAll(async () => {
    await connectDB();  // Connect to DB
});

// Close MongoDB after tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Preferences Router', () => {
    test('GET /api/preferences - should return 404 if no preferences are found', async () => {
        const response = await request(app).get('/api/preferences');
        expect(response.status).toBe(404); // Expected response status when no data found
    });
});
