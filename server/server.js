const express = require('express');
const connectDB = require('./db');
const restaurantRoutes = require('./routes/restaurants');
const userRoutes = require('./routes/user');
const menuRoutes = require('./routes/menus');
const menuItemRoutes = require('./routes/menuItems');


const app = express();

connectDB();

app.use(express.json());

// Routes

app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

app.use('/api', restaurantRoutes);
app.use('/api', userRoutes);
app.use('/api', menuRoutes);
app.use('/api', menuItemRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})