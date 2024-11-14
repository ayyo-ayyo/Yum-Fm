//Preferences 

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    This file defines the format/schema that all Preferences must fit in the database.
*/

const preferencesSchema = new Schema({
    preference_id: {type: Number, required: true, unique: true},
    user_id: {type: Number, required: true, ref: "Restriction"},
    preference_severity: {type: Number, required: true},
    preference_name: {type: String, required: true}
    
});

const preferences = mongoose.model('Preferences', preferencesSchema);
module.exports = preferences;
