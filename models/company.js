'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const companySchema = Schema({
    name: String,
    direction: String,
    phone: Number,
    employees: [{type: Schema.Types.ObjectId, ref: 'employee'}]
});

module.exports = Mongoose.model('company', companySchema);