const Restaurant = require('../models/restaurant-model');
const buildDefaultRouter = require('./route-template');

module.exports = {
    restaurantRouter: buildDefaultRouter('restaurants', Restaurant)
};