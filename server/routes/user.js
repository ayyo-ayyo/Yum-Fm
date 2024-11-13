const User = require('../models/user-model');
const buildDefaultRouter = require('./route-template');

const userRouter = buildDefaultRouter('users', User);

userRouter.get('/users/login', (req, res) => {
    if (!('username' in req.query)) {
        res.status(400).send('"username" parameter must be provided for login');
        return;
    }
    if (!('password' in req.query)) {
        res.status(400).send('"password" parameter must be provided for login');
        return;
    }

    User.aggregate().match({
        username: req.query.username,
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

module.exports = userRouter;