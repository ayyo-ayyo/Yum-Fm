const express = require('express');
const connectDB = require('./db');

const app = express();


connectDB();


app.use(express.json());

// Routes

app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})