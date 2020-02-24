'use strict'

const Express = require('express');
const api = Express.Router();

const companyController = require('../controllers/company.controller');

//PARTE 1

api.post('/save', companyController.registerCompany);
api.put('/update/:id', companyController.updateCompany);
api.delete('/delete/:id', companyController.deleteCompany);
api.get('/employeesQuantity/:id', companyController.employeesQuantity);

api.put('/addEmployee/:id', companyController.setEmployees);
api.put('/removeEmployee/:id', companyController.removeEmployees);

//PARTE 2

api.post('/login', companyController.login);

module.exports = api;

//PRODUCTOS>SUCURSAL>EMPRESA
//Productos por empresa es la suma de los productos de las sucursales sucursales.