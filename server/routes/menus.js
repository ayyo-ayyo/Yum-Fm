const Menu = require('../models/menu-model');
const buildDefaultRouter = require('./route-template');

/*
    This file defines the routes necessary for Menus
*/
module.exports = buildDefaultRouter('menus', Menu);