const Restriction = require('../models/restrictions-model');
const buildDefaultRouter = require('./route-template');

/*
    This file defines the routes necessary for Restrictions
*/
module.exports = buildDefaultRouter('restrictions', Restriction);