const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { restaurantRouter } = require('./routes/restaurants');
const userRouter = require('./routes/user');
const menuRouter = require('./routes/menus');
const menuItemRouter = require('./routes/menuItems');
const searchRouter = require('./routes/search');

const app = express();

// Middleware
app.use(cors());  // Enable CORS
app.use(express.json());  // JSON parsing
connectDB();  // Connect to the database

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

app.use('/api', restaurantRouter, userRouter, menuRouter, menuItemRouter, searchRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
