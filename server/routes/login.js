const express = require('express');
const User = require('../models/user-model');
const mongoose = require('mongoose');

const loginRouter = express.Router();

loginRouter.get('/login', (req, res) => {
    if (!('user_name' in req.query)) {
        res.status(400).send('"user_name" parameter must be provided for login');
        return;
    }
    if (!('password' in req.query)) {
        res.status(400).send('"password" parameter must be provided for login');
        return;
    }

    User.aggregate().match({
        user_name: req.query.user_name,
        password: req.query.password
    }).exec()
        .then(matchedUser => {
            res.status(200).json(matchedUser);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

loginRouter.post('/login', async (req, res) => {
    try {
        const model = new User({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        })

        const result = await model.save();
        res.status(201).json(model);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } 
});

module.exports = loginRouter;