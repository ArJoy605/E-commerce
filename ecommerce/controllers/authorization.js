const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

const register = async (req, res) => {
    try {
        const {
 name, email, password, phone, address 
} = req.body;
        if (!name) {
            return res.send({ message: 'Name is Required' });
        }
        if (!email) {
            return res.send({ message: 'Email is Required' });
        }
        if (!password) {
            return res.send({ message: 'Password is Required' });
        }
        if (!phone) {
            return res.send({ message: 'Phone Number is Required' });
        }
        if (!address) {
            return res.send({ message: 'Address is Required' });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already Registered',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
        }).save();

        res.status(201).send({
            success: true,
            message: 'User Registerd Successfully',
            user,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Registration Failed',
            err,
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password',
            });
        }
        // check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registerd',
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password',
            });
        }
        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2d',
        });
        res.status(200).send({
            success: true,
            message: 'login successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error,
        });
    }
};

const testController = (req, res) => {
    res.send('protected ROute');
};
// orders

const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate('products', '-photo')
            .populate('buyer', 'name')
            .sort({ createdAt: '-1' });
        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error Fetching Orders',
            err,
        });
    }
};
const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate('products', '-photo')
            .populate('buyer', 'name')
            .populate('payment')
            .sort({ createdAt: '-1' });
        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error Fetching Orders',
            err,
        });
    }
};

const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        console.log(orderId);
        console.log(status);
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error while updating status of order',
            err,
        });
    }
};

module.exports = {
    register,
    loginController,
    testController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController,
};
