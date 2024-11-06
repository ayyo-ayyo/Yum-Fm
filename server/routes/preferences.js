const Preference = require('../models/preferences-model');
const buildDefaultRouter = require('./route-template');

module.exports = buildDefaultRouter('preferences', Preference);


