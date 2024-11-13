const MenuItem = require('../models/menuItem-model');
const buildDefaultRouter = require('./route-template');

/*
    This file defines the routes necessary for MenuItems
*/

module.exports = buildDefaultRouter('menuItems', MenuItem);