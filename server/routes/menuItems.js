const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenuItem = require('../models/menuItems');

// Adds new menu item
router.post('/menuitems', async (req, res) => {
    try {
        const item = new MenuItem({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        })

        const result = await item.save();
        res.status(201).json(item);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Deletes the menu item based on id
router.delete('/menuitems/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such menu item' });
        }
        const result = await MenuItem.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'No such menu item' });
        }
        res.status(200).send("Menu item deleted");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Update an existing menu item's data
router.put('/menuitems/:id', async (req, res) => {
    try {
        const result = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ error: 'No such menu item' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});