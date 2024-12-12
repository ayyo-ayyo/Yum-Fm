// __tests__/usersRouter.test.js
const request = require('supertest');
const app = require('../server'); // Make sure your server.js file is correctly referenced
const mongoose = require('mongoose');
const User = require('../models/user-model');
const connectDB = require('../db');
const { clearAllTimeouts } = require('../token_manager');



beforeAll(async () => {
    await connectDB();  // Connect to DB
});

// Close MongoDB after tests
afterAll(async () => {
    await mongoose.connection.close();
    clearAllTimeouts();
});

function getLoginToken() {
    return request(app).post('/api/login').send({email: 'test@gmail.com', password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}).then(res => res.body.token);
}

describe('User Router', () => {
    test('GET /api/users - should fail without login token', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(401); // Check for successful response
        expect(response.text).toBe('Invalid access token');
    });

    test('GET /api/users - should fetch all items', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/users').set('Authorization', token);
        expect(response.status).toBe(200); // Check for successful response
        expect(Array.isArray(response.body)).toBe(true); // Ensure response is an array
    });

    test('GET /api/users/id - should fetch a specific user', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/users/67579f81ceaa03b2ed73b1aa').set('Authorization', token);
        expect(response.status).toBe(200); // Check for successful response
        expect(response.body.password).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
    });

    test('GET /api/users/id - should fail without login token', async () => {
        const response = await request(app).get('/api/users/67579f81ceaa03b2ed73b1aa');
        expect(response.status).toBe(401); // Check for successful response
    });

    test('GET /api/users/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/users/10').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('POST /api/users/ - should fail if no email is given', async () => {
        const response = await request(app).post('/api/users/').send({password: 'test'});
        expect(response.status).toBe(500); // Invalid post
    });

    test('POST /api/users/ - should fail if no password is given', async () => {
        const response = await request(app).post('/api/restaurants/').send({email: 'test1000@gmail.com'});
        expect(response.status).toBe(500); // Invalid post
    });

    test('POST /api/users/ - should succeed if given the correct parameters', async () => {
        const response = await request(app).post('/api/users/').send({email: 'test1000@gmail.com', user_name: "test", password:'test', });
        expect(response.status).toBe(201); // Successfully created

        // Delete the newly created document
        await User.deleteMany({email: 'test1000@gmail.com'}).exec();
    });

    test('DELETE /api/users/id - should fail with no login token', async () => {
        const response = await request(app).delete('/api/users/10');
        expect(response.status).toBe(401); // No token
    });

    test('DELETE /api/users/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).delete('/api/users/10').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('DELETE /api/users/id - should successfully delete an item', async () => {
        const newId = new mongoose.Types.ObjectId();

        const testUser = new User({
            _id: newId,
            email: 'test1000@gmail.com',
            password: 'test',
            user_name: 'test'
        });

        await testUser.save()

        const token = await getLoginToken();
        const response = await request(app).delete(`/api/users/${newId}`).set('Authorization', token);
        expect(response.status).toBe(200); // Item shouldn't be found
    });

    test('PUT /api/users/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).put('/api/users/6666fb9ca0a008b0abc6fbf8').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('PUT /api/users/id - should successfully update a document', async () => {
        const newId = new mongoose.Types.ObjectId();

        const testUser = new User({
            _id: newId,
            email: 'test1000@gmail.com',
            password: 'test',
            user_name: 'test'
        });

        await testUser.save()

        const token = await getLoginToken();
        const response = await request(app).put(`/api/users/${newId}`).set('Authorization', token).send({user_name: 'new name'});
        expect(response.status).toBe(200); // Item shouldn't be found
        expect(response.body.user_name).toBe('new name');

        await User.deleteMany({email: 'test1000@gmail.com'});
    });
});
