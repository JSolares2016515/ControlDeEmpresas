'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const employeeSchema = Schema({
    name: String,
    lastname: String,
    charge: String,
    department: String,
});

module.exports = Mongoose.model('employee', employeeSchema);