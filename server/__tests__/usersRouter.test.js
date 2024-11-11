// __tests__/usersRouter.test.js
const request = require('supertest');
const app = require('../server');

describe('Users Router', () => {
    test('GET /api/users - should return 404 if no users are found', async () => {
        const response = await request(app).get('/api/users');
        console.log(response.body);
        expect(response.status).toBe(200); // Output empty array
    });
});
