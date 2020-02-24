'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const companySchema = Schema({
    name: String,
    direction: String,
    phone: Number,
    password: String,
    employees: [{type: Schema.Types.ObjectId, ref: 'employee'}],
    branchoffices: [{type: Schema.Types.ObjectId, ref: 'branchoffice'}]
});

module.exports = Mongoose.model('company', companySchema);