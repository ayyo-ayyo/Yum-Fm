// __tests__/restaurantMenuItemsRouter.test.js
const request = require('supertest');
const app = require('../server'); // Make sure your server.js file is correctly referenced
const mongoose = require('mongoose');
const menuItem = require('../models/menuItem-model');
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

describe('MenuItems Router', () => {
    test('GET /api/menuItems - should fail without login token', async () => {
        const response = await request(app).get('/api/menuItems');
        expect(response.status).toBe(401); // Check for successful response
        expect(response.text).toBe('Invalid access token');
    });

    test('GET /api/menuItems - should fetch all items', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/menuItems').set('Authorization', token);
        expect(response.status).toBe(200); // Check for successful response
        expect(Array.isArray(response.body)).toBe(true); // Ensure response is an array
    });

    test('GET /api/menuItems/id - should fetch a specific menuItems', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/menuItems/6734fb9ca0a008b0abc6fbfb').set('Authorization', token);
        expect(response.status).toBe(200); // Check for successful response
        expect(response.body.menu_item_id).toBe(0);
    });

    test('GET /api/menuItems/id - should fail without login token', async () => {
        const response = await request(app).get('/api/menuItems/6734fb9ca0a008b0abc6fbfb');
        expect(response.status).toBe(401); // Check for successful response
    });

    test('GET /api/menuItems/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/menuItems/10').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('POST /api/menuItems/ - should fail if no menu_item_id is given', async () => {
        const response = await request(app).post('/api/menuItems/').send({menu_id: 100, item_name: 'test'});
        expect(response.status).toBe(500); // Invalid post
    });

    test('POST /api/menus/ - should fail if no menu_id is given', async () => {
        const response = await request(app).post('/api/menuItems/').send({menu_item_id: 100, item_name: 'test'});
        expect(response.status).toBe(500); // Invalid post
    });

    test('POST /api/menus/ - should fail if no item_name is given', async () => {
        const response = await request(app).post('/api/menuItems/').send({menu_item_id: 100, menu_id: 10});
        expect(response.status).toBe(500); // Invalid post
    });

    test('POST /api/menus/ - should succeed if menu_id, menu_item_id, and item_name, is given', async () => {
        const response = await request(app).post('/api/menuItems/').send({menu_item_id: -100, menu_id: -100, item_name: 'test'});
        expect(response.status).toBe(201); // Successfully created

        // Delete the newly created document
        await menuItem.deleteMany({menu_item_id: -100}).exec();
    });

    test('DELETE /api/menuItems/id - should fail with no login token', async () => {
        const response = await request(app).delete('/api/menuItems/10');
        expect(response.status).toBe(401); // No token
    });

    test('DELETE /api/menuItems/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).delete('/api/menuItems/10').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('DELETE /api/menuItems/id - should successfully delete an item', async () => {
        const newId = new mongoose.Types.ObjectId();

        const testItem = new menuItem({
            _id: newId,
            menu_id: -99,
            menu_item_id: -99,
            item_name: 'test'
        });

        await testItem.save()

        const token = await getLoginToken();
        const response = await request(app).delete(`/api/menuItems/${newId}`).set('Authorization', token);
        expect(response.status).toBe(200); // Item shouldn't be found
    });

    test('PUT /api/menuItems/id - should fail with invalid id', async () => {
        const token = await getLoginToken();
        const response = await request(app).put('/api/menuItems/6666fb9ca0a008b0abc6fbf8').set('Authorization', token);
        expect(response.status).toBe(404); // Item shouldn't be found
    });

    test('PUT /api/menuItems/id - should successfully update a document', async () => {
        const newId = new mongoose.Types.ObjectId();

        const testItem = new menuItem({
            _id: newId,
            menu_id: -99,
            menu_item_id: -99,
            item_name: 'test'
        });


        await testItem.save()

        const token = await getLoginToken();
        const response = await request(app).put(`/api/menuItems/${newId}`).set('Authorization', token).send({menu_verified: false});
        expect(response.status).toBe(200); // Item shouldn't be found
        expect(response.body.item_name).toBe('test');

        await menuItem.deleteMany({menu_item_id: -99});
    });
});
