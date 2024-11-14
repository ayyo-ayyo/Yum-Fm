const mongoose = require('mongoose');

// These pull the environment variable DB_URI, which stores the string necessary to access the MongoDB database
require('dotenv').config();
const dbUri = process.env.DB_URI

// The main function which establishes a connection to the MongoDB database
const connectDB = async () => {
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }) // Make the connection
        .then(() => console.log('MongoDB connected...')) // Log if the connection was successful
        .catch(console.log); // Otherwise, log the error to descbribe why the connection could not be established
};

module.exports = connectDB;
