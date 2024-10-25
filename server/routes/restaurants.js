const Restaurant = require('../models/restaurants-model');
const buildDefaultRouter = require('./route-template');

module.exports = buildDefaultRouter('restaurants', Restaurant);