'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const productSchema = Schema({
    name: String,
    description: String,
    price: Number
});

module.exports = Mongoose.model('product', productSchema);