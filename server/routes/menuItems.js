const MenuItem = require('../models/menuItem-model');
const buildDefaultRouter = require('./route-template');

module.exports = buildDefaultRouter('menuItems', MenuItem);