const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const connect = require('./database_Con/db');
const routing = require('./routes/routing');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routing
app.use('/api/v1/auth', routing);
app.use('/api/v1/product', productRoutes);

app.get('/', (req, res) => {
    res.send({
        message: 'Welcome',
    });
});

app.listen(4000, () => {
    console.log('listening to port 4000');
});
