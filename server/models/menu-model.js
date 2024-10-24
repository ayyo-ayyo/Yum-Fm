// menu.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    menu_id: { type: Number, required: true, unique: true },
    restaurant_id: { type: Number, required: true, ref: 'Restaurant' },
    menu_rating: { type: Number },
    menu_upload_date: { type: Date, required: true },
    menu_verified: { type: Boolean, required: true }
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
