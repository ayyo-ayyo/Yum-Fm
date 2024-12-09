require('dotenv').config();

const dbUri = process.env.DB_URI

const connectDB = require('../db');
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant-model');
const Menu = require('../models/menu-model');
const MenuItem = require('../models/menuItem-model');
const fs = require('node:fs');

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
            console.log(`Successfully saved menu id: ${newMenu.menu_id}`);
        })
        .catch(console.log);
}

async function createNewMenuItem(menuItemId, menuId, itemName, price, fulfilled_filters) {
    const newMenuItem = new MenuItem({
        menu_item_id: menuItemId,
        menu_id: menuId,
        item_name: itemName,
        item_price: price,
        item_fulfilled_filters: fulfilled_filters
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
            await createNewMenuItem(newMenuItemId, newMenuId, curItem.name, curItem.price, curItem.item_fulfilled_filters);
        } catch(err) {
            console.log(`Error for file num: ${i}`);
            console.log(err);
        }        
    }

    console.log("Done!");
    mongoose.disconnect();
};

//processRestaurant('../menus/pasta e basta/', 'Pasta E Basta', 1, 51);



function consolidateItems(path) {
    const items = []
    const ITEM_LIMIT = 200

    fs.readdirSync(path).forEach(fileName => {
        try {
            if (items.length >= ITEM_LIMIT) {
                console.log(`Hit item limit, only processing ${ITEM_LIMIT} items!`);
                return;
            }
            const curItem = require(path + fileName);

            items.push({
                name: curItem.name,
                price: curItem.price
            })
        }
        catch (err) {
            console.log(`Error for file num: ${i}`);
            console.log(err);
        }
    });

    return items;
}

async function uploadConsolidatedMenuItems(path, restName) {
    await connectDB();
    const newRestId = await getNextAvailableRestId();
    await createNewRestaurant(restName, newRestId);

    const newMenuId = await getNextAvailableMenuId();
    await createNewMenu(newMenuId, newRestId, new Date(), false);

    try {
        const itemArr = require(path);

        for (const element of itemArr) {
            const newMenuItemId = await getNextAvailableMenuItemId();
            await createNewMenuItem(newMenuItemId, newMenuId, element.name, element.price, element.item_fulfilled_filters);
        }
    }
    catch (err) {
        console.log(`Failed to load file: ${err}`);
    }
    finally {
        await mongoose.disconnect();
    }
}

async function chatGPTConvert(data) {
    const openai_url = 'https://api.openai.com/v1/chat/completions'
    if (process.env.OPENAI_KEY === undefined) {
        throw Error('OPENAI_KEY not available');
    }

    const response = await fetch(openai_url, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "model": "gpt-4o",
            "n": 1,
            //"response_format": { "type": "json_object" },
            "messages": [
                {
                    "role": "user",
                    "content": `Can you modify the following JSON array so that every element has a new string array called 'item_fulfilled_filters'. The output MUST be an array that contains ${data.length} objects, each with a name, price, and item_fulfilled_filters. The item_fulfilled_filters arrary represents the dietary restrictions that each item is VERY LIKELY to satisfy based on the item's name. The dietary restrictions I want you to apply are Vegetarian – No meat, fish, or poultry.Vegan – No animal products, including meat, dairy, eggs, or honey.Gluten-Free – No wheat, barley, rye, or oatsLactose-Free – No dairy productsNut-Free – No peanuts or tree nuts.Soy-Free – No soy products.Egg-Free – No eggs or egg-based products.Keto/Low-Carb – High fat, very low carb diet.Paleo – Focuses on whole foods, excluding grains, legumes, and processed foods.Halal – Foods that meet Islamic dietary laws (no pork, alcohol, etc.).Kosher – Foods prepared in compliance with Jewish dietary laws.Low-Sodium – Minimal salt in foods.Low-Fat – Reduced fat content.Diabetic-Friendly – Foods that maintain stable blood sugar levels.Allergen-Free – Avoidance of specific allergens (e.g., shellfish, sesame, etc.).`
                },
                {
                    "role": "user",
                    "content": JSON.stringify(data)
                }
            ]
        })
    });

    const resJson = await response.json();

    console.log('------------------');
    console.log(resJson);
    console.log('------------------');

    return resJson.choices[0].message.content;
}

if (process.argv.length != 4) {
    console.log('Incorrect number of arguments passed, must include mode and path to menu');
    return;
}

switch (process.argv[2]) {
    case 'addfilters':
        const menuItems = consolidateItems(process.argv[3]);
        console.log(menuItems);
        console.log(`Successfully processed ${menuItems.length} items!`);
        console.log('Uploading menuItems to GPT 4o...');
        chatGPTConvert(menuItems)
            .then(itemsWithFilters => {
                console.log('Successfully received items with filters!');
                console.log('Writing to newest.json...');
                fs.writeFile('./newest.json', itemsWithFilters, err => {
                    if (err) {
                      console.error(err);
                    }
                    else {
                        console.log('Data written to newest.json!');
                    }
                });
            });
        break;
    case 'upload':
        uploadConsolidatedMenuItems('./newest.json', process.argv[3]);
        break;
    default:
        throw Error('Unknown mode');
}



//chatGPTConvert(require('./consolidated.json')).then(console.log);

//console.log(consolidateItems('../../menus/110\ grill/', 1, 83));

//uploadConsolidatedMenuItems('./newest.json', "Athena's Pizza").then(() => console.log("Done!"));

/*
 PROMPT:

Given the following JSON data based on a restaurant's menu items, can you add a new string array to each of them called "item_fulfilled_filters" that represents the dietary restrictions that each item is VERY LIKELY to satisfy. The dietary restrictions I want you to apply are 
Vegetarian – No meat, fish, or poultry.
Vegan – No animal products, including meat, dairy, eggs, or honey.
Gluten-Free – No wheat, barley, rye, or oats
Lactose-Free – No dairy products
Nut-Free – No peanuts or tree nuts.
Soy-Free – No soy products.
Egg-Free – No eggs or egg-based products.
Keto/Low-Carb – High fat, very low carb diet.
Paleo – Focuses on whole foods, excluding grains, legumes, and processed foods.
Halal – Foods that meet Islamic dietary laws (no pork, alcohol, etc.).
Kosher – Foods prepared in compliance with Jewish dietary laws.
Low-Sodium – Minimal salt in foods.
Low-Fat – Reduced fat content.
Diabetic-Friendly – Foods that maintain stable blood sugar levels.
Allergen-Free – Avoidance of specific allergens (e.g., shellfish, sesame, etc.).

Each item in the JSON array should have an item_fulfilled_filters
*/