const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { restaurantRouter } = require('./routes/restaurants');
const userRouter = require('./routes/user');
const menuRouter = require('./routes/menus');
const menuItemRouter = require('./routes/menuItems');
const searchRouter = require('./routes/search');
const loginRouter = require('./routes/login');

const app = express();

// Middleware
app.use(cors());  // Enable CORS
app.use(express.json());  // JSON parsing
connectDB();  // Connect to the database

app.use('/api', restaurantRouter, userRouter, menuRouter, menuItemRouter, searchRouter, loginRouter);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

module.exports = app;

// Only start the server if we're running this file directly (not during testing or if already running)
if (require.main === module && !global.serverIsRunning) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        global.serverIsRunning = true;  // Set the flag to indicate the server is running
    });
}