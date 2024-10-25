require('dotenv').config();

const dbUri = process.env.DB_URI

const mongoose = require('mongoose');
const Restaurant = require('./models/restaurants');
    
const connectDB = async () => {
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected...'))
        .then(() =>
            // Try an Atlas Search query
            Restaurant.aggregate().search({
                index: "restaurant_index",
                text: {
                    query: "philly",
                    path: "restaurant_name"
                }
            }).exec()
        )
        .then(console.log) // Log the results of the aggregate
        .catch(console.log);
};

module.exports = connectDB;
