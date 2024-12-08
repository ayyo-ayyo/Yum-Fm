const express = require('express');
const MenuItem = require('../models/menuItem-model');
const Menu = require('../models/menu-model');

/*
    This file defines the routes necessary for MenuItems
*/

const buildDefaultRouter = require('./route-template');
const router = buildDefaultRouter('menuItems', MenuItem);

// Route to get all menu items associated with a given restaurant's menu
router.get('/by-restaurant/:restaurant_id', async (req, res) => {
    try {
        const { restaurant_id } = req.params;

        // Find the menu for this restaurant
        const menu = await Menu.findOne({ restaurant_id: restaurant_id });
        if (!menu) {
            return res.status(404).json({ message: "No menu available for this restaurant" });
        }

        // Fetch menu items associated with this menu_id
        const menuItems = await MenuItem.find({ menu_id: menu.menu_id });

        res.status(200).json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching menu items" });
    }
});

module.exports = router;
