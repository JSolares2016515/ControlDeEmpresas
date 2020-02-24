'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;ç

const branchOfficeSchema = Schema({
    name = String,
    direction = String,
    products = [{type:Schema.Types.ObjectId, ref: 'product'}]
});

module.exports = Mongoose.model('branchoffice', branchOfficeSchema);