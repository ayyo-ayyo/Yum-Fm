// __tests__/menusRouter.test.js
const request = require('supertest');
const app = require('../server'); // Make sure your server.js file is correctly referenced
const mongoose = require('mongoose');
const Menu = require('../models/menu-model');
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

describe('Menus Router', () => {
    test('GET /api/menus - should fail without login token', async () => {
        const response = await request(app).get('/api/menus');
        expect(response.status).toBe(401); // Check for successful response
        expect(response.text).toBe('Invalid access token');
    });

    test('GET /api/menus - should fetch all menus', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/menus').set('Authorization', token);
        expect(response.status).toBe(200); // Check for successful response
        expect(Array.isArray(response.body)).toBe(true); // Ensure response is an array
    });

    test('GET /api/menus/id - should fetch a specific menu', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/menus/6734fb9ca0a008b0abc6fbf8').set('Authorization', token);
        expect(response.status).toBe(200); // Check for successful response
        expect(response.body.menu_id).toBe(0);
    });

    test('GET /api/menus/id - should fail without login token', async () => {
        const response = await request(app).get('/api/menus/6734fb9ca0a008b0abc6fbf8');
        expect(response.status).toBe(401); // Check for successful response
    });

    test('GET /api/menus/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/menus/10').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('POST /api/menus/ - should fail if no menu_id is given', async () => {
        const response = await request(app).post('/api/menus/').send({restaurant_id: 100});
        expect(response.status).toBe(500); // Invalid post
    });

    test('POST /api/menus/ - should fail if no restaurant_id is given', async () => {
        const response = await request(app).post('/api/menus/').send({menu_id: 100});
        expect(response.status).toBe(500); // Invalid post
    });

    test('POST /api/menus/ - should succeed if menu_id, restaurant_id, menu_upload_date, and menu_verified, is given', async () => {
        const response = await request(app).post('/api/menus/').send({restaurant_id: -100, menu_id: -100, menu_upload_date: new Date(), menu_verified: true});
        expect(response.status).toBe(201); // Successfully created

        // Delete the newly created document
        await Menu.deleteMany({restaurant_id: -100}).exec();
    });

    test('DELETE /api/menus/id - should fail with no login token', async () => {
        const response = await request(app).delete('/api/menus/10');
        expect(response.status).toBe(401); // No token
    });

    test('DELETE /api/menus/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).delete('/api/menus/10').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('DELETE /api/menus/id - should successfully delete an item', async () => {
        const newId = new mongoose.Types.ObjectId();

        const testMenu = new Menu({
            _id: newId,
            restaurant_id: -99,
            menu_id: -99,
            menu_upload_date: new Date(),
            menu_verified: true
        });

        await testMenu.save()

        const token = await getLoginToken();
        const response = await request(app).delete(`/api/menus/${newId}`).set('Authorization', token);
        expect(response.status).toBe(200); // Item shouldn't be found
    });

    test('PUT /api/menus/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).put('/api/menus/6666fb9ca0a008b0abc6fbf8').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('PUT /api/menus/id - should successfully update a document', async () => {
        const newId = new mongoose.Types.ObjectId();

        const testMenu = new Menu({
            _id: newId,
            restaurant_id: -99,
            menu_id: -99,
            menu_upload_date: new Date(),
            menu_verified: true
        });

        await testMenu.save()

        const token = await getLoginToken();
        const response = await request(app).put(`/api/menus/${newId}`).set('Authorization', token).send({menu_verified: false});
        expect(response.status).toBe(200); // Item shouldn't be found
        expect(response.body.menu_verified).toBe(false);

        await Menu.deleteMany({menu_id: -99});
    });
});
