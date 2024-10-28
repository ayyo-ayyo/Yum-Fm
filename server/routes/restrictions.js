const Restriction = require('../models/restrictions-model');
const buildDefaultRouter = require('./route-template');

module.exports = buildDefaultRouter('restrictions', Restriction);