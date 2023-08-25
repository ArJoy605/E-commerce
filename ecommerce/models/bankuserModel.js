const mongoose = require('mongoose');

const bankuserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            default: 500000,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('bankusers', bankuserSchema);
