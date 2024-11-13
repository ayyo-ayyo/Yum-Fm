const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const connectDB = require('../db');
const {expect, test, beforeAll, afterAll, describe} = require('@jest/globals');


beforeAll(async () => {
    await connectDB();  // Connect to DB
});

afterAll(async () => {
    await mongoose.connection.close();

});

describe('General search tests', () => {
    test('GET /search with no query, should be invalid', async () => {
        const response = await request(app).get('/api/search?type=restaurant');
        expect(response.status).toBe(400);  // Should be an error, since query is mandatory
    });

    test('GET /search with no type, should be invalid', async () => {
        const response = await request(app).get('/api/search?q=Test');
        expect(response.status).toBe(400); // Bad request
    });
});

describe('Restaurant search tests', () => {
    test('GET /search with known full restaurant name returns expected result', async () => {
        const response = await request(app).get('/api/search?q=Ocean+Restaurant&type=restaurant');
        expect(response.status).toBe(200); // Success
        expect(response.body[0]).toHaveProperty('restaurant_name', 'Ocean Restaurant');
        expect(response.body[0]).toHaveProperty('restaurant_desc', 'Seafood, Sushi, Steak');
    });

    test('GET /search with partial restaurant name, should correctly return similar results', async () => {
        const response = await request(app).get('/api/search?q=Oce&type=restaurant');
        expect(response.status).toBe(200); // Success
        expect(response.body.some((curRest) => { // Ocean Restaurant should be included somewhere in the list of returned restaurants
            return 'restaurant_name' in curRest 
                    && curRest.restaurant_name == 'Ocean Restaurant'
                    && 'restaurant_desc' in curRest
                    && curRest.restaurant_desc == 'Seafood, Sushi, Steak';
        })).toBe(true);
    });
    test('GET /search with non-existent restaurant should return no results', async () => {
        const response = await request(app).get('/api/search?q=abcdefgh&type=restaurant');
        expect(response.status).toBe(200); // Success
        expect(response.body).toEqual([]);
    });
});

