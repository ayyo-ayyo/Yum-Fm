const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Menu = require('../models/menus');

// Adds new menu
router.post('/menus', async (req, res) => {
    try {
        const menu = new Menu({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        })

        const result = await menu.save();
        res.status(201).json(menu);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Deletes the menu based on id
router.delete('/menus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such menu' });
        }
        const result = await Menu.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'No such menu' });
        }
        res.status(200).send("Menu deleted");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Update an existing menu's data
router.put('/menus/:id', async (req, res) => {
    try {
        const result = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ error: 'No such menu' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router