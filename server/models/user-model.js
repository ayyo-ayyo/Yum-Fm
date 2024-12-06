// user.js
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    This file defines the format/schema that all Users must fit in the database.
*/

const userSchema = new Schema({
    user_id: { type: Number, required: true, unique: true },
    email: { type: String, required: true },
    password: {type: String, required: true},
    address: {type: String, required: false},
    phone_number: {type: String, required: false},
    user_name: {type: String, required: true},
    favorites_list: { 
        type: [ObjectId], 
        required: true,
        default: [] 
    }
});

const user = mongoose.model('User', userSchema);

module.exports = user;
