// __tests__/preferencesRouter.test.js
const request = require('supertest');
const app = require('../server');

describe('Preferences Router', () => {
    test('GET /api/preferences - should return 404 if no preferences are found', async () => {
        const response = await request(app).get('/api/preferences');
        expect(response.status).toBe(404); // Expected response status when no data found
    });
});
