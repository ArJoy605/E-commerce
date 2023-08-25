const fs = require('fs');
const slugify = require('slugify');
const braintree = require('braintree');
const axios = require('axios');
const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel');

// payment

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: 'r8yz6n3qv9kgmtjw',
    publicKey: 'nkg3jhz9mjqwgdgm',
    privateKey: '873ea88c0ea721b7615e3b6a71883fde',
});
const createProductController = async (req, res) => {
    try {
        const {
 name, slug, description, price, quantity, shipping 
} = req.fields;
        const { photo } = req.files;
        if (!description) {
            return res.status(500).send({ message: 'Description is Required' });
        }
        if (!price) {
            return res.status(500).send({ message: 'Price is Required' });
        }
        if (!quantity) {
            return res.status(500).send({ message: 'Quantity is Required' });
        }

        if (photo && photo.size > 1000000) {
            return res.status(500).send({ message: 'Photo should be less than 1MB' });
        }

        const products = await new productModel({
            ...req.fields,
            slug: slugify(name),
        });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: 'Product Added Successfully ',
            products,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            err,
            message: 'Error Adding Product',
        });
    }
};

const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .select('-photo')
            .limit(10)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            totalcount: products.length,
            message: 'Showing Products',
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Product',
            error: error.message,
        });
    }
};

const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select('-photo');
        res.status(200).send({
            success: true,
            message: 'Fetched Single Product',
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Product',
            error: error.message,
        });
    }
};
const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select('photo');
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Product Photo',
            error: error.message,
        });
    }
};
const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success: true,
            message: 'Product Deleted Successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error Deleting the Product',
            error: error.message,
        });
    }
};
const updateProductController = async (req, res) => {
    try {
        const {
 name, slug, description, price, quantity, shipping 
} = req.fields;
        const { photo } = req.files;
        if (!description) {
            return res.status(500).send({ message: 'Description is Required' });
        }
        if (!price) {
            return res.status(500).send({ message: 'Price is Required' });
        }
        if (!quantity) {
            return res.status(500).send({ message: 'Quantity is Required' });
        }

        if (photo && photo.size > 1000000) {
            return res.status(500).send({ message: 'Photo should be less than 1MB' });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: 'Product Updated Successfully ',
            products,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            err,
            message: 'Error Updating Product',
        });
    }
};

// payment gateway api
const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, (err, response) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (err) {
        console.log(err);
    }
};
const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce, userEmail } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        const newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            (error, result) => {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(err);
                }
            }
        );

        const bill = new FormData();
        bill.append('amount', total);
        const { data } = axios.put(
            `http://localhost:5000/bank/auth/reduce-user/${userEmail}`,
            bill
        );
        const { data2 } = axios.put(
            'http://localhost:5000/bank/auth/increase-user/arjoy@gmail.com',
            bill
        );
        console.log(data.message);
        console.log(data2.message);
    }
     catch (err) {
        console.log(err);
    }
};

module.exports = {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    braintreePaymentController,
    braintreeTokenController,
};
