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
                    && curRest.restaurant_name === 'Ocean Restaurant'
                    && 'restaurant_desc' in curRest
                    && curRest.restaurant_desc === 'Seafood, Sushi, Steak';
        })).toBe(true);
    });
    test('GET /search with non-existent restaurant should return no results', async () => {
        const response = await request(app).get('/api/search?q=abcdefgh&type=restaurant');
        expect(response.status).toBe(200); // Success
        expect(response.body).toEqual([]);
    });

    test('GET /search should only return results which contain filters that match mfilters', async () => {
        const respBoth = await request(app).get('/api/search?q=fresh&type=restaurant&mfilters=test_filter_1');
        expect(respBoth.body.length).toBe(2);

        const respOne = await request(app).get('/api/search?q=fresh&type=restaurant&mfilters=test_filter_1,test_filter_2');
        expect(respOne.body.length).toBe(1);
        expect(respOne.body[0]).toHaveProperty('restaurant_name', 'Philly Fresh Cheesesteaks (541-B Graymont Ave)');
    });
});

describe('Menuitem search tests', () => {
    test('GET /search with known full menuitem name returns expected result', async () => {
        const response = await request(app).get('/api/search?q=sandwich&type=menuitem');
        expect(response.status).toBe(200); // Success
        expect(response.body[0]).toHaveProperty('item_name', 'sandwich');
        expect(response.body[0]).toHaveProperty('item_price', 5.5);
    });

    test('GET /search with partial menuitem name should correctly return similar results', async () => {
        const response = await request(app).get('/api/search?q=sa&type=menuitem');
        expect(response.status).toBe(200); // Success
        expect(response.body.some((curItem) => { // Ocean Restaurant should be included somewhere in the list of returned restaurants
            return 'item_name' in curItem 
                    && curItem.item_name == 'sandwich'
                    && 'item_price' in curItem
                    && curItem.item_price === 5.5;
        })).toBe(true);
    });
    test('GET /search with non-existent menuitem should return no results', async () => {
        const response = await request(app).get('/api/search?q=abcdefgh&type=menuitem');
        expect(response.status).toBe(200); // Success
        expect(response.body).toEqual([]);
    });
});