'use strict'

const Express = require('express');
const api = Express.Router();

const companyController = require('../controllers/company.controller');

api.post('/save', companyController.registerCompany);
api.put('/update/:id', companyController.updateCompany);

module.exports = api;