const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    This file defines the format/schema that all Restrictions must fit in the database.
*/

const restrictionsSchema = new Schema({
    restrictions_id: {type: Number, required: true, unique: true},
    user_id: {type: Number, required: true, ref: "User"},
    restriction_severity: {type: Number, required: true},
    restriction_name: {type: String, required: true}
    
});

const restrictions = mongoose.model('Restrictions', restrictionsSchema);
module.exports = restrictions;