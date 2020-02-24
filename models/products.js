'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const productSchema = Schema({
    name: String,
    type: String,
    stock: Number,
});