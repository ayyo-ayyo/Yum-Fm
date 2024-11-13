require('dotenv').config();

const dbUri = process.env.DB_URI

const mongoose = require('mongoose');
const Restaurant = require('./models/restaurant-model');
const Menu = require('./models/menu-model');
    
const connectDB = async () => {
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected...'))
        .catch(console.log);
};

// --- Add hangar ---
// const restaurantSchema = new Schema({
//     restaurant_id: { type: Number, required: true, unique: true },
//     restaurant_name: { type: String, required: true },
//     restaurant_desc: { type: String },
//     rest_fulfilled_filters: [String]
// });

async function getNextAvailableRestId() {
    const restWithMax = await Restaurant.aggregate().sort({
        restaurant_id: -1
    }).limit(1);

    return restWithMax[0].restaurant_id + 1;
}

async function getNextAvailableMenuId() {
    const menuWithMax = await Menu.aggregate().sort({
        menu_id: -1
    }).limit(1);

    return menuWithMax[0].menu_id + 1;
}

async function createNewRestaurant(name, restId, menuIds) {
    const newRest = new Restaurant({
        _id: new mongoose.Types.ObjectId(),
        restaurant_name: name,
        restaurant_id: restId,
        menu_ids: menuIds,
        rest_fulfilled_filters: []
    });

    newRest.save()
        .then(() => {
            console.log(`Successfully saved restaurant id: ${newRest.restaurant_id}`);
        })
        .catch(console.log);
}

async function createNewMenu() {
    const menuSchema = new Schema({
        menu_id: { type: Number, required: true, unique: true },
        restaurant_id: { type: Number, required: true, ref: 'Restaurant' },
        menu_rating: { type: Number },
        menu_upload_date: { type: Date, required: true },
        menu_verified: { type: Boolean, required: true }
    });
}

connectDB();

// for (let i = 2; i <= 54; i++) {

// }