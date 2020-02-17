'use strict'

const Express = require('express');
const api = Express.Router();

const employeeController = require('../controllers/employee.controller');

api.post('/save', employeeController.saveEmployee);
api.put('/update/:id', employeeController.updateEmployee);
api.delete('/delete/:id', employeeController.deleteEmployee);
api.get('/search/:search', employeeController.searchEmployees);
api.get('/list', employeeController.listEmployees);

module.exports = api;