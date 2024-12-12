const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const connectDB = require('../db');
const {expect, test, beforeAll, afterAll, describe} = require('@jest/globals');
const { clearAllTimeouts } = require('../token_manager');


beforeAll(async () => {
    await connectDB();  // Connect to DB
});

afterAll(async () => {
    await mongoose.connection.close();
    clearAllTimeouts();
});

function getLoginToken() {
    return request(app).post('/api/login').send({email: 'test@gmail.com', password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}).then(res => res.body.token);
}

describe('General search tests', () => {
    test('GET /search with no login token should fail', async () => {
        const response = await request(app).get('/api/search?type=restaurant');
        expect(response.status).toBe(401);  // Should be an error, since login token is mandatory
    });

    test('GET /search with no query, should be invalid', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/search?type=restaurant').set('Authorization', token);
        expect(response.status).toBe(400);  // Should be an error, since query is mandatory
    });

    test('GET /search with no type, should be invalid', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/search?q=Test').set('Authorization', token);
        expect(response.status).toBe(400); // Bad request
    });
});

describe('Restaurant search tests', () => {
    test('GET /search with known full restaurant name returns expected result', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/search?q=Pasta+E+Basta&type=restaurant').set('Authorization', token);
        expect(response.status).toBe(200); // Success
        expect(response.body[0]).toHaveProperty('restaurant_name', 'Pasta E Basta');
    });

    test('GET /search with partial restaurant name, should correctly return similar results', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/search?q=Past&type=restaurant').set('Authorization', token);
        expect(response.status).toBe(200); // Success
        expect(response.body.some((curRest) => { // Pasta E Basta should be included somewhere in the list of returned restaurants
            return 'restaurant_name' in curRest 
                    && curRest.restaurant_name === 'Pasta E Basta'
        })).toBe(true);
    });
    test('GET /search with non-existent restaurant should return no results', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/search?q=abcdefgh&type=restaurant').set('Authorization', token);
        expect(response.status).toBe(200); // Success
        expect(response.body).toEqual([]);
    });

    test('GET /search should only return results which contain filters that match mfilters', async () => {
        const token = await getLoginToken();
        let resp = await request(app).get('/api/search?q=B&type=restaurant&mfilters=Paleo').set('Authorization', token);
        expect(resp.body.length).toBeGreaterThan(0);

        resp.body.forEach(rest => {
            expect(rest.rest_fulfilled_filters).toContain('Paleo');
        });

        resp = await request(app).get('/api/search?q=B&type=restaurant&mfilters=Paleo,Vegan').set('Authorization', token);
        expect(resp.body.length).toBeGreaterThan(0);
        
        resp.body.forEach(rest => {
            expect(rest.rest_fulfilled_filters).toContain('Paleo');
            expect(rest.rest_fulfilled_filters).toContain('Vegan');
        });
    });
});

describe('Menuitem search tests', () => {
    test('GET /search with known full menuitem name returns expected result', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/search?q=French+Vanilla+Latte&type=menuitem').set('Authorization', token);
        expect(response.status).toBe(200); // Success
        expect(response.body[0].item).toHaveProperty('item_name', 'French Vanilla Latte');
        expect(response.body[0].item).toHaveProperty('item_price', 2.89);
    });

    test('GET /search with partial menuitem name should correctly return similar results', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/search?q=Fre&type=menuitem').set('Authorization', token);
        expect(response.status).toBe(200); // Success
        expect(response.body.some((curItem) => { // French Fries should be included somewhere in the list of returned restaurants
            return 'item_name' in curItem.item 
                    && curItem.item.item_name == 'French Fries'
                    && 'item_price' in curItem.item
                    && curItem.item.item_price === 4.99;
        })).toBe(true);
    });
    test('GET /search with non-existent menuitem should return no results', async () => {
        const token = await getLoginToken();
        const response = await request(app).get('/api/search?q=abcdefgh&type=menuitem').set('Authorization', token);
        expect(response.status).toBe(200); // Success
        expect(response.body).toEqual([]);
    });
});