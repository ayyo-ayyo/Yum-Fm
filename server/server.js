const express = require('express');
const connectDB = require('./db');
const restaurantRouter = require('./routes/restaurants');
const userRouter = require('./routes/user');
const menuRouter = require('./routes/menus');
const menuItemRouter = require('./routes/menuItems');


const app = express();

connectDB();

app.use(express.json());

// Routes

app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

app.use('/api', restaurantRouter);
app.use('/api', userRouter);
app.use('/api', menuRouter);
app.use('/api', menuItemRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

