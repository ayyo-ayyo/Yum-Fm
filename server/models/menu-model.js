// menu-model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    This file defines the format/schema that all Menus must fit in the database.
*/

const menuSchema = new Schema({
    menu_id: { type: Number, required: true, unique: true },
    restaurant_id: { type: Number, required: true, ref: 'Restaurant' },
    menu_rating: { type: Number },
    menu_upload_date: { type: Date, required: true },
    menu_verified: { type: Boolean, required: true }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
