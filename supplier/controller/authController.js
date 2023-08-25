const supplierModel = require("../models/supplierModel");
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');

const registerController = async (req, res) =>{
    try{
        const {name , email, password} = req.body;
        //validation

        if(!name){
            return res.send({message:'Name is Required'})
        }
        if(!email){
            return res.send({message: 'Email is required'});
        }
        if(!password){
            return res.send({message: 'Password is required'});
        }


        const existingSupplier = await supplierModel.findOne({email});     
        if(existingSupplier){
            return response.status(200).send({
                success:false,
                message:'Already Registered'
            })
        }
        
        const hashedPassword  = await bcrypt.hash(password, 10);

        const supplier = await new supplierModel({
            name,
            email,
            password: hashedPassword,
        }).save();

        res.status(201).send({
            success: true,
            message: 'Supplier Registerd Successfully',
            supplier,
        });
        

    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Error in Registration",
            err
        });
    }

}


const loginController = async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message: 'Email is required'
            });
        }
        
        const supplier = await supplierModel.findOne({ email });
        if (!supplier) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registerd',
            });
        }
        const match = await bcrypt.compare(password, supplier.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password',
            });
        }

        const token = await JWT.sign({ _id: supplier._id }, 'amarsonarbangladesh', {
            expiresIn: '2d',
        });
        res.status(200).send({
            success: true,
            message: 'logged in successfully',
            user: {
                _id: supplier._id,
                name: supplier.name,
                email: supplier.email,
            },
            token,
        });

    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Error in Login",
            err
        });
    }
}

const testController = (req, res) =>{
    res.send({message:'Protected Route'});
}

const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({status: ['Processing', 'Shipping'] })
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
    registerController,
    loginController,
    testController,
    getAllOrdersController,
    orderStatusController,
};
