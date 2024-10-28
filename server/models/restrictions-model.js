// restrictions

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restrictionsSchema = new Schema({
    restrictions_id: {type: Number, required: true, unique: true},
    user_id: {type: Number, required: true, ref: "User"},
    restriction_severity: {type: Number, required: true},
    restriction_name: {type: String, required: true}
    
});

const restrictions = mongoose.model('Restrictions', restrictionsSchema);
module.exports = restrictions;