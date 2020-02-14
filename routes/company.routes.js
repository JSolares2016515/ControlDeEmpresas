'use strict'

const Express = require('express');
const api = Express.Router();

const companyController = require('../controllers/company.controller');

api.post('/save', companyController.registerCompany);
api.put('/update/:id', companyController.updateCompany);
api.delete('/delete/:id', companyController.deleteCompany);
api.get('/employeesQuantity/:id', companyController.employeesQuantity);

api.put('/addEmployee/:id', companyController.setEmployees);
api.put('/removeEmployee/:id', companyController.removeEmployees);

module.exports = api;