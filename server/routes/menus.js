const Menu = require('../models/menu-model');
const buildDefaultRouter = require('./route-template');

module.exports = buildDefaultRouter('menus', Menu);