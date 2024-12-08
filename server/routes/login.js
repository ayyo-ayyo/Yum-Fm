const express = require('express');
const User = require('../models/user-model');
const mongoose = require('mongoose');
const tm = require('../token_manager');

/*
    This file defines custom routes necessary for login and retrieving user information
*/

const loginRouter = express.Router();

// Define the POST /login route, which will will be used to sign a user in and retrieve profile information
// Requires the mandatory body fields email=<email here> and password=<password here>
loginRouter.post('/login', (req, res) => {
    // Ensure the mandatory parameters are given

    if (!('email' in req.body)) {
        res.status(400).send('"email" must be provided for login');
        return;
    }

    if (!('password' in req.body)) {
        res.status(400).send('"password" must be provided for login');
        return;
    }

    console.log(req.body);

    // If they are, find the matching user in the database
    User.aggregate().match({
        email: req.body.email,
        password: req.body.password
    }).exec()
        .then(matchedUsers => {
            console.log(matchedUsers);

            if (matchedUsers.length == 0) {
                res.status(400).send("Invalid username or password");
                return;
            }

            const user = matchedUsers[0];
            const token = tm.generateNewToken(user._id)
            console.log(`Generated token "${token}" for user "${user._id}"`);
            res.status(200).json({_id: user._id, token: token}); // Send the user information if successful
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: err}); // Otherwise, report the error to the client
        });
});

// Define the POST /signup route, which will will be used to create a new user
loginRouter.post('/signup', async (req, res) => {
    try {
        const model = new User({ // Make sure the given document matches the User schema
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });

        // Validate that the email does not already exist 
        const matchedUsers = await User.aggregate().match({
            email: req.body.email,
        }).exec();

        if (matchedUsers.length != 0) {
            res.status(400).send("Email already in use!");
            return;
        }

        // Otherwise, create the account

        await model.save(); // Attempt to add the new user to the data base
        res.sendStatus(201); // If successful, inform the client
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err }); // Otherwise, send the error
    } 
});

module.exports = loginRouter;