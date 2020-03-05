'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const companySchema = Schema({
    name: String,
    direction: String,
    phone: Number,
    password: String,
    branchoffices: [{
        name: String,
        direction: String,
        products: [{
            product: [{type:Schema.Types.ObjectId, ref: 'product'}],
            quantity: Number
        }]
    }],
    employees: [{type: Schema.Types.ObjectId, ref: 'employee'}],
    products: [{
        product: [{type:Schema.Types.ObjectId, ref: 'product'}],
        quantity: Number
    }]
});

module.exports = Mongoose.model('company', companySchema);