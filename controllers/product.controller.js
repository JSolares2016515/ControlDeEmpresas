'use strict'

const Product = require('../models/products');

function addProduct(req, res) {
    const params = req.body;
    const product = Product();
    if (params.name && params.price) {
        product.name = params.name;
        product.description = params.description;
        product.price = params.price;
        product.save((err, productSaved) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (productSaved) {
                res.send({'Product Created': productSaved});
            } else {
                res.status(503).send({message: 'Producto no creado, intente de nuevo más tarde'});
            }
        });
    }
}

function updateProduct(req, res) {
    const productID = req.params.id;
    const update = req.body;
    Product.findByIdAndUpdate(productID, update, {new: true}, (err, productUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (productUpdated) {
            res.send({'Product Updated': productUpdated});
        } else {
            res.status(503).send({message: 'Producto no actualizado, intente de nuevo más tarde'});
        }
    });
}

function deleteProduct(req, res) {
    const productID = req.params.id;
    Product.findByIdAndDelete(productID, (err, productDeleted) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (productDeleted) {
            res.send({'Product Deleted': productDeleted});
        } else {
            res.status(503).send({message: 'Producto no eliminado, intente de nuevo más tarde'});
        }
    });
}

function listProducts(req, res) {
    Product.find({}, (err, products) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (products) {
            res.send({'Products': products});
        } else {
            res.status(503).send({message: 'No se encontro ningún producto, intente de nuevo más tarde'});
        }
    });
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    listProducts
}