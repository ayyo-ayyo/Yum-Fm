require('dotenv').config();

const dbUri = process.env.DB_URI

const mongoose = require('mongoose');
    
const connectDB = async () => {
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected...'))
        .catch(err => console.log(err));
};

module.exports = connectDB;


