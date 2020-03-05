'use strict'

const Express = require('express');
const api = Express.Router();

const productController = require('../controllers/product.controller');

api.post('/add', productController.addProduct);
api.put('/update/:id', productController.updateProduct);
api.delete('/delete/:id', productController.deleteProduct);
api.get('/list', productController.listProducts);

module.exports = api;