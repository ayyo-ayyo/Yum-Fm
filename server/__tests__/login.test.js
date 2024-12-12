// __tests__/menusRouter.test.js
const request = require('supertest');
const app = require('../server'); // Make sure your server.js file is correctly referenced
const mongoose = require('mongoose');
const connectDB = require('../db');
const { clearAllTimeouts } = require('../token_manager');
const User = require('../models/user-model');

/* This file has the unit tests for the login/signup system */

beforeAll(async () => {
    await connectDB();  // Connect to DB
});

// Close MongoDB after tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Login Tests', () => {
    test('POST /api/login - Should fail when no email / password given', async () => {
        const response = await request(app).post('/api/login');
        expect(response.status).toBe(400); // Check for error response
    });

    test('POST /api/login - Should fail when email is provided but no password given', async () => {
        const response = await request(app).post('/api/login').send({email: 'test@gmail.com'});
        expect(response.status).toBe(400); // Check for error response
        expect(response.text).toBe('"password" must be provided for login');
    });

    test('POST /api/login - Should fail when password is provided but no email given', async () => {
        const response = await request(app).post('/api/login').send({password: 'TestPassword'});
        expect(response.status).toBe(400); // Check for error response
        expect(response.text).toBe('"email" must be provided for login');
    });

    test('POST /api/login - Should fail if a non-existant email is given', async () => {
        const response = await request(app).post('/api/login').send({email: "emaildoesnotexist@test.com", password: 'TestPassword'});
        expect(response.status).toBe(400); // Check for error response
        expect(response.text).toBe('Invalid username or password');
    });

    test('POST /api/login - Should fail if a correct email is given with an incorrect password', async () => {
        const response = await request(app).post('/api/login').send({email: "test@gmail.com", password: 'FakePassword'});
        expect(response.status).toBe(400); // Check for error response
        expect(response.text).toBe('Invalid username or password');
    });

    test('POST /api/login - Should correctly sign in with an existing user and password', async () => {
        const response = await request(app).post('/api/login').send({email: "test@gmail.com", password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'});
        expect(response.status).toBe(200); // Check for successful response
        clearAllTimeouts(); // Have to clear the timeouts from token_manager
    });

    test('POST /api/login - Should correctly return a user id and token', async () => {
        const response = await request(app).post('/api/login').send({email: "test@gmail.com", password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'});
        expect(response.status).toBe(200); // Check for error response
        expect('_id' in response.body).toBe(true);
        expect('token' in response.body).toBe(true);

        clearAllTimeouts(); // Have to clear the timeouts from token_manager
    });
});

describe('Signup Tests', () => {
    test('POST /api/signup - Should fail when no email / password given', async () => {
        const response = await request(app).post('/api/signup');
        expect(response.status).toBe(500); // Check for error response
    });

    test('POST /api/signup - Should fail when email is given but no password given', async () => {
        const response = await request(app).post('/api/signup').send({email: "jest_test@gmail.com"});
        expect(response.status).toBe(500); // Check for error response
    });

    test('POST /api/signup - Should fail when password is given but no email given', async () => {
        const response = await request(app).post('/api/signup').send({password: "TestPassword"});
        expect(response.status).toBe(500); // Check for error response
    });

    test('POST /api/signup - Should fail when an email already in use is given', async () => {
        const response = await request(app).post('/api/signup').send({email: "test@gmail.com", password: "test"});
        expect(response.status).toBe(400); // Check for error response
        expect(response.text).toBe('Email already in use!');
    });

    test('POST /api/signup - Should successfully add account when new email is given', async () => {
        const response = await request(app).post('/api/signup').send({user_name: "test_username", email: "jest_test@gmail.com", password: 'test'});
        expect(response.status).toBe(201); // Check for error response

        const newUser = await User.findOne({'email': 'jest_test@gmail.com'}).exec();

        expect(newUser.email).toBe('jest_test@gmail.com');

        // Now delete the user
        await User.deleteOne({email: 'jest_test@gmail.com'}).exec();
    });
});