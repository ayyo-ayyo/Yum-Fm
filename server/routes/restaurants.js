const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurants');

router.post('/restaurants', async (req, res) => {
    try {
        const restaurant = new Restaurant({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    })

    const result = await restaurant.save();
    res.status(201).json(restaurant);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
    
})

router.delete('/restaurants/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such restaurant' });
        }
        const result = await Restaurant.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'No such restaurant' });
        }
        res.send("Restaurant deleted");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/restaurants/:id', async (req, res) => {
    try {
        const result = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ error: 'No such restaurant' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }

})


module.exports = router