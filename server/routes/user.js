const User = require('../models/user-model');
const buildDefaultRouter = require('./route-template');

module.exports = buildDefaultRouter('users', User);