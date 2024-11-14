const Restaurant = require('../models/restaurant-model');
const buildDefaultRouter = require('./route-template');
const mongoose = require('mongoose');

/*
    This file defines the routes necessary for Restaurants
*/
module.exports = buildDefaultRouter('restaurants', Restaurant)

