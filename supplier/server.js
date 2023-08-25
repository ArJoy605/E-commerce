const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');


connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/supplier/auth', authRoutes);

app.get("/supplier", (req,res) =>{
    res.send("<h1>Bangladesh</h1>");
});


const port = 6000;

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})