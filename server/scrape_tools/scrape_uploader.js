require('dotenv').config();

const dbUri = process.env.DB_URI

const connectDB = require('../db');
const Restaurant = require('../models/restaurant-model');
const Menu = require('../models/menu-model');
const MenuItem = require('../models/menuItem-model');

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

    if (restWithMax.length == 0){
        return 0;
    }

    return restWithMax[0].restaurant_id + 1;
}

async function getNextAvailableMenuId() {
    const menuWithMax = await Menu.aggregate().sort({
        menu_id: -1
    }).limit(1);

    if (menuWithMax.length == 0){
        return 0;
    }

    return menuWithMax[0].menu_id + 1;
}

async function getNextAvailableMenuItemId() {
    const itemWithMax = await MenuItem.aggregate().sort({
        menu_item_id: -1
    }).limit(1);

    if (itemWithMax.length == 0){
        return 0;
    }

    return itemWithMax[0].menu_item_id + 1;
}

async function createNewRestaurant(name, restId) {
    const newRest = new Restaurant({
        _id: new mongoose.Types.ObjectId(),
        restaurant_name: name,
        restaurant_id: restId,
        rest_fulfilled_filters: []
    });

    await newRest.save()
        .then(() => {
            console.log(`Successfully saved restaurant id: ${newRest.restaurant_id}`);
        })
        .catch(console.log);
}

async function createNewMenu(menuId, restId, date, verified) {
    const newMenu = new Menu({
        menu_id: menuId,
        restaurant_id: restId,
        menu_upload_date: date,
        menu_verified: verified
    });

    await newMenu.save()
        .then(() => {
            console.log(`Successfully saved menu id: ${newMenu.menuId}`);
        })
        .catch(console.log);
}

async function createNewMenuItem(menuItemId, menuId, itemName, price) {
    const newMenuItem = new MenuItem({
        menu_item_id: menuItemId,
        menu_id: menuId,
        item_name: itemName,
        item_price: price
    });

    await newMenuItem.save()
        .then(() => {
            console.log(`Successfully saved menu item id: ${newMenuItem.menu_item_id}`);
        })
        .catch(console.log);
}

const processRestaurant = async (path, restName, min, max) => {
    await connectDB();
    const newRestId = await getNextAvailableRestId();
    await createNewRestaurant(restName, newRestId);

    const newMenuId = await getNextAvailableMenuId();
    await createNewMenu(newMenuId, newRestId, new Date(), false);

    for (let i = min; i <= max; i++) {
        try {
            const curItem = require(path + String(i).padStart(3, '0'));
            console.log(`Num: ${i} | Name: ${curItem.name} | Price: ${curItem.price}`);

            const newMenuItemId = await getNextAvailableMenuItemId();
            await createNewMenuItem(newMenuItemId, newMenuId, curItem.name, curItem.price);
        } catch(err) {
            console.log(`Error for file num: ${i}`);
            console.log(err);
        }        
    }

    console.log("Done!");
    mongoose.disconnect();
};

processRestaurant('../menus/pasta e basta/', 'Pasta E Basta', 1, 51);

// for (let i = 2; i <= 54; i++) {

// }