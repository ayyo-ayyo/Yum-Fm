const express = require('express');
const connectDB = require('./db');
const restaurantRoutes = require('./routes/restaurants');
const app = express();


connectDB();


app.use(express.json());

// Routes

app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});
app.use('/api', restaurantRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})