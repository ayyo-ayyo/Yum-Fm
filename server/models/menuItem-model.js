// menuItem-model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    This file defines the format/schema that all MenuItems must fit in the database.
*/

const menuItemSchema = new Schema({
    menu_item_id: { type: Number, required: true, unique: true },
    menu_id: { type: Number, required: true, ref: 'Menu' },
    item_name: { type: String, required: true },
    category: { type: String },
    course: { type: String },
    item_fulfilled_filters: [String],
    item_price: { type: Number }
});

const menuItem = mongoose.model('RestaurantMenuItem', menuItemSchema);

module.exports = menuItem;
