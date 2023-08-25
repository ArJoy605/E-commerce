const supplierModel = require("../models/supplierModel");
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const bankuserModel = require('../models/bankuserModel');

const registerController = async (req, res) =>{
    try{
        const {name , email, password, balance} = req.body;
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


        const existingbankuser = await bankuserModel.findOne({email});     
        if(existingbankuser){
            return response.status(200).send({
                success:false,
                message:'Already Registered'
            })
        }
        
        const hashedPassword  = await bcrypt.hash(password, 10);

        const bankuser = await new bankuserModel({
            name,
            email,
            password: hashedPassword,
            balance,
        }).save();

        res.status(201).send({
            success: true,
            message: 'bank User Registerd Successfully',
            bankuser,
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
        
        const bankuser = await bankuserModel.findOne({ email });
        if (!bankuser) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registerd',
            });
        }
        const match = await bcrypt.compare(password, bankuser.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password',
            });
        }

        const token = await JWT.sign({ _id: bankuser._id }, 'amarsonarbangladesh', {
            expiresIn: '2d',
        });
        res.status(200).send({
            success: true,
            message: 'logged in successfully',
            user: {
                _id: bankuser._id,
                name: bankuser.name,
                email: bankuser.email,
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

const getAccountInfo = async(req, res) =>{
    try{
        const bankuser = await bankuserModel.findOne({email: req.params.email});
        res.status(200).send({
        success:true,
        message:'Fetched Single User',
        bankuser,
    });
    }catch(err){{
        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in Getting user info',
            error: err.message,
        });
    }}

}

const reduceUserAccount = async (req, res) => {
    try {
        const { amount } = req.fields;
        if (!amount) {
            return res.status(500).send({ message: 'Amount is Required' });
        }

        const bankuser = await bankuserModel.findOneAndUpdate(
            { email: req.params.email },
            { $inc: { balance: -amount } },
            { new: true }
        );

        if (!bankuser) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Balance Updated Successfully',
            newBalance: bankuser.balance
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Balance Updating Failed',
            error: error.message,
        });
    }
};


const increaseUserAccount = async (req, res) => {
    try {
        const { amount } = req.fields;
        if (!amount) {
            return res.status(500).send({ message: 'Amount is Required' });
        }

        const bankuser = await bankuserModel.findOneAndUpdate(
            { email: req.params.email },
            { $inc: { balance: amount } },
            { new: true }
        );

        if (!bankuser) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Balance Updated Successfully',
            newBalance: bankuser.balance
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Balance Updating Failed',
            error: error.message,
        });
    }
};




module.exports = {
    registerController,
    loginController,
    testController,
    getAccountInfo,
    reduceUserAccount,
    increaseUserAccount,
};
