//Preferences 

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferencesSchema = new Schema({
    preference_id: {type: Number, required: true, unique: true},
    user_id: {type: Number, required: true, ref: "Restriction"},
    preference_severity: {type: Number, required: true},
    preference_name: {type: String, required: true}
    
});

const preferences = mongoose.model('Preferences', preferencesSchema);
module.exports = preferences;
