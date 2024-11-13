// user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    This file defines the format/schema that all Users must fit in the database.
*/

const userSchema = new Schema({
    user_id: { type: Number, required: true, unique: true },
    user_name: { type: String, required: true }
});

const user = mongoose.model('User', userSchema);

module.exports = user;
