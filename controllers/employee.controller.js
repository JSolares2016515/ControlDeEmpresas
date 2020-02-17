'use strict'

const Employee = require('../models/employee');

function saveEmployee(req, res) {
    const params = req.body;
    const employee = Employee();
    if (params.name && params.lastname && params.charge && params.department) {
        employee.name = params.name;
        employee.lastname = params.lastname;
        employee.charge = params.charge;
        employee.department = params.department;
        employee.save((err, employeeSaved) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (employeeSaved) {
                res.send({'Employee Saved': employeeSaved});
            } else {
                res.status(503).send({message: 'Usuario no guardado, intente más tarde'});
            }
        });
    } else {
        res.status(400).send({message: 'Ingrese todos los datos'});
    }
}

function updateEmployee(req, res) {
    const employeeID = req.params.id;
    const update = req.body;
    Employee.findByIdAndUpdate(employeeID, update, {new: true},(err, employeeUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (employeeUpdated) {
            res.send({'Employee Updated': employeeUpdated});
        } else {
            res.status(503).send({message: 'No se ha podido actualizar, intente más tarde'});
        }
    });
}

function deleteEmployee(req, res) {
    const employeeID = req.params.id;
    Employee.findByIdAndDelete(employeeID, (err, employeeDeleted) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (employeeDeleted) {
            res.send({'Employee Deleted': employeeDeleted});
        } else {
            res.status(503).send({message: 'No se ha podido eliminar, intente más tarde'});
        }
    });
}

function searchEmployees(req, res) {
    const search = req.params.search;
    Employee.find({$or: [{name: {$regex: `${search}`, $options: 'i'}}, {lastname: {$regex: `${search}`, $options: 'i'}}, {charge: {$regex: `${search}`, $options: 'i'}}, {department: {$regex: `${search}`, $options: 'i'}}]}, (err, employees) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (employees) {
            res.send({Employees: employees});
        } else {
            res.status(503).send({message: 'No se encontraron empleados'});
        }
    });
}

function listEmployees(req, res) {
    Employee.find({}, (err, employees) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (employees) {
            res.send({Employees: employees});
        } else {
            res.status(503).send({message: 'No se encontraron empleados'});
        }
    });
}

module.exports = {
    saveEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    listEmployees
}