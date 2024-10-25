const express = require('express');
const connectDB = require('./db');
const { restaurantRouter } = require('./routes/restaurants');
const userRouter = require('./routes/user');
const menuRouter = require('./routes/menus');
const menuItemRouter = require('./routes/menuItems');
const searchRouter = require('./routes/search')


const app = express();

connectDB();

app.use(express.json());

// Routes

app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

app.use('/api',
    restaurantRouter,
    userRouter,
    menuRouter,
    menuItemRouter,
    searchRouter
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

