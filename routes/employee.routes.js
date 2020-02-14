'use strict'

const Express = require('express');
const api = Express.Router();

const employeeController = require('../controllers/employee.controller');

api.post('/save', employeeController.saveEmployee);
api.put('/update', employeeController.updateEmployee);

module.exports = api;