const Restaurant = require('../models/restaurant-model');
const buildDefaultRouter = require('./route-template');
const mongoose = require('mongoose');

module.exports = {
    restaurantRouter: buildDefaultRouter('restaurants', Restaurant)
};

