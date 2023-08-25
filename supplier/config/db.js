const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        const conn =  await mongoose.connect('mongodb://localhost/Ecommerce');
        console.log(`Listening to mongodb ${conn.connection.host}`);
    }catch(err){
        console.log(err);
    }
}


module.exports = connectDB;