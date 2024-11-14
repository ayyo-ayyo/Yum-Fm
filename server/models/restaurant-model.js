// restaurant-model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    restaurant_id: { type: Number, required: true, unique: true },
    restaurant_name: { type: String, required: true },
    restaurant_desc: { type: String },
    rest_fulfilled_filters: [String]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
