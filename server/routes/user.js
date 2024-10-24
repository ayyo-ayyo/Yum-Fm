const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

// Adds new user
router.post('/users', async (req, res) => {
    try {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        })

        const result = await user.save();
        res.status(201).json(user);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Deletes the user based on id
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such user' });
        }
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'No such user' });
        }
        res.status(200).send("User deleted");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Update an existing user's data
router.put('/users/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ error: 'No such user' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router