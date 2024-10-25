require('dotenv').config();

const dbUri = process.env.DB_URI

const mongoose = require('mongoose');
const Restaurant = require('./models/restaurant-model');
    
const connectDB = async () => {
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected...'))
        .catch(console.log);
};

module.exports = connectDB;
