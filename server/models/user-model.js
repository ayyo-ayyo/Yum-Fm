// user.js
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    This file defines the format/schema that all Users must fit in the database.
*/

const userSchema = new Schema({
    //user_id: { type: Number, required: true, unique: true },
    email: { type: String, required: true },
    password: {type: String, required: true},
    address: {type: String, required: false},
    phone_number: {type: String, required: false},
    user_name: {type: String, required: true},
    favorites_list: { 
        type: [String], 
        required: true,
        default: [] 
    },
    restrictions: {
        type: [String],
        required: true,
        default: []
    }
    // restrictions: {
    //     type: Map,
    //     of: Boolean,
    //     required: true,
    //     default: () => ({
    //         'Vegetarian': false,
    //         'Vegan': false,
    //         'Gluten-Free': false,
    //         'Lactose-Free': false,
    //         'Nut-Free': false,
    //         'Soy-Free': false,
    //         'Egg-Free': false,
    //         'Keto/Low-Carb': false,
    //         'Paleo': false,
    //         'Halal': false,
    //         'Kosher': false,
    //         'Low-Sodium': false,
    //         'Low-Fat': false,
    //         'Diabetic-Friendly': false,
    //         'Allergen-Free': false
    //     })
    // }
});

const user = mongoose.model('User', userSchema);

module.exports = user;
