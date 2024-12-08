// restaurant-model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    This file defines the format/schema that all Restaurants must fit in the database.
*/

const restaurantSchema = new Schema({
    restaurant_id: { type: Number, required: true, unique: true },
    restaurant_name: { type: String, required: true },
    restaurant_desc: { type: String },
    restaurant_img: {type: String},
    rest_fulfilled_filters: [String]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
