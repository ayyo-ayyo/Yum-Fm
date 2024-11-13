const User = require('../models/user-model');
const buildDefaultRouter = require('./route-template');

/*
    This file defines the routes necessary for Users
*/
module.exports = buildDefaultRouter('users', User);