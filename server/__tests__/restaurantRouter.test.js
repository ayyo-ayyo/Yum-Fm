// __tests__/restaurantRouter.test.js
const request = require('supertest');
const app = require('../server'); // Make sure your server.js file is correctly referenced
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant-model');
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

describe('Restaurant Router', () => {
    test('GET /api/restaurants - should fail without login token', async () => {
        const response = await request(app).get('/api/restaurants');
        expect(response.status).toBe(401); // Check for successful response
        expect(response.text).toBe('Invalid access token');
    });

    test('GET /api/restaurants - should fetch all items', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/restaurants').set('Authorization', token);
        expect(response.status).toBe(200); // Check for successful response
        expect(Array.isArray(response.body)).toBe(true); // Ensure response is an array
    });

    test('GET /api/restaurants/id - should fetch a specific restaurants', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/restaurants/6734fb9ba0a008b0abc6fbf1').set('Authorization', token);
        expect(response.status).toBe(200); // Check for successful response
        expect(response.body.restaurant_id).toBe(21);
    });

    test('GET /api/restaurants/id - should fail without login token', async () => {
        const response = await request(app).get('/api/restaurants/6734fb9ba0a008b0abc6fbf1');
        expect(response.status).toBe(401); // Check for successful response
    });

    test('GET /api/restaurants/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/restaurants/10').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('POST /api/restaurants/ - should fail if no restaurant_id is given', async () => {
        const response = await request(app).post('/api/restaurants/').send({restaurant_name: 'test'});
        expect(response.status).toBe(500); // Invalid post
    });

    test('POST /api/restaurants/ - should fail if no restaurant_name is given', async () => {
        const response = await request(app).post('/api/restaurants/').send({restaurant_id: 100});
        expect(response.status).toBe(500); // Invalid post
    });

    test('POST /api/restaurants/ - should succeed if restaurant_id and restaurant_name is given', async () => {
        const response = await request(app).post('/api/restaurants/').send({restaurant_id: -100, restaurant_name: "test"});
        expect(response.status).toBe(201); // Successfully created

        // Delete the newly created document
        await Restaurant.deleteMany({restaurant_id: -100}).exec();
    });

    test('DELETE /api/restaurants/id - should fail with no login token', async () => {
        const response = await request(app).delete('/api/restaurants/10');
        expect(response.status).toBe(401); // No token
    });

    test('DELETE /api/restaurants/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).delete('/api/restaurants/10').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('DELETE /api/restaurants/id - should successfully delete an item', async () => {
        const newId = new mongoose.Types.ObjectId();

        const testRest = new Restaurant({
            _id: newId,
            restaurant_id: -100,
            restaurant_name: 'test'
        });

        await testRest.save()

        const token = await getLoginToken();
        const response = await request(app).delete(`/api/restaurants/${newId}`).set('Authorization', token);
        expect(response.status).toBe(200); // Item shouldn't be found
    });

    test('PUT /api/restaurants/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).put('/api/restaurants/6666fb9ca0a008b0abc6fbf8').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('PUT /api/restaurants/id - should successfully update a document', async () => {
        const newId = new mongoose.Types.ObjectId();

        const testRest = new Restaurant({
            _id: newId,
            restaurant_id: -100,
            restaurant_name: 'test',
        });


        await testRest.save()

        const token = await getLoginToken();
        const response = await request(app).put(`/api/restaurants/${newId}`).set('Authorization', token).send({restaurant_name: 'new name'});
        expect(response.status).toBe(200); // Item shouldn't be found
        expect(response.body.restaurant_name).toBe('new name');

        await Restaurant.deleteMany({restaurant_id: -100});
    });
});
