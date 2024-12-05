const express = require('express');
const User = require('../models/user-model');
const mongoose = require('mongoose');

/*
    This file defines custom routes necessary for login and retrieving user information
*/

const loginRouter = express.Router();

// Define the GET /login route, which will will be used to sign a user in and retrieve profile information
// Requires the mandatory parameters /login?user_name=<username here>&password=<password here>
loginRouter.get('/login', (req, res) => {
    // Ensure the mandatory parameters are given
    if (!('email' in req.query)) {
        res.status(400).send('"user_name" parameter must be provided for login');
        return;
    }
    if (!('password' in req.query)) {
        res.status(400).send('"password" parameter must be provided for login');
        return;
    }

    // If they are, find the matching user in the database
    User.aggregate().match({
        user_name: req.query.user_name,
        password: req.query.password
    }).exec()
        .then(matchedUser => {
            res.status(200).json(matchedUser); // Send the user information if successful
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err}); // Otherwise, report the error to the client
        });
});

// Define the GET /login route, which will will be used to create a new user
// The user_name, password, and temporarily the user_id must be given in the body of the request
loginRouter.post('/login', async (req, res) => {
    try {
        const model = new User({ // Make sure the given document matches the User schema
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });

        await model.save(); // Attempt to add the new user to the data base
        res.status(201).json(model); // If successful, inform the client
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err }); // Otherwise, send the error
    } 
});

module.exports = loginRouter;