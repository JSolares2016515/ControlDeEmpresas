'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const branchOfficeSchema = Schema({
    name: String,
    direction: String,
    products: {
        product: [{type:Schema.Types.ObjectId, ref: 'product'}],
        quantity: Number
    }
});

module.exports = Mongoose.model('branchoffice', branchOfficeSchema);