const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connect = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost/Ecommerce');
        console.log(`Connected to Mongo ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
    }
};

module.exports = connect;
