const Preference = require('../models/preferences-model');
const buildDefaultRouter = require('./route-template');

/*
    This file defines the routes necessary for Preferences
*/
module.exports = buildDefaultRouter('preferences', Preference);


