const Restaurant = require('../models/restaurants-model');
const buildDefaultRouter = require('./route-template');
const mongoose = require('mongoose');

const router = buildDefaultRouter('restaurants', Restaurant);

// Add custom search route for restaurants by name
router.get('/restaurants/search', async (req, res) => {
    try {
        const { query } = req.query;
        const results = await Restaurant.find({
            restaurant_name: { $regex: query, $options: 'i' }  // Case-insensitive search
        }).limit(10); // Limit the number of results

        res.status(200).json(results);
    } catch (error) {
        console.error('Error searching restaurants:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

