const User = require('../models/user-model');
const buildDefaultRouter = require('./route-template');

const userRouter = buildDefaultRouter('users', User);
module.exports = userRouter;