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
                res.send({Employee: employeeSaved});
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
    Employee.findByIdAndUpdate(employeeID, update, (err, employeeUpdated) => {
        if (err) {
            res.status(500).send({message: ''});
        } else if (employeeUpdated) {
            res.send({'Employee Updated': employeeUpdated});
        } else {
            res.status(503).send({message: 'No se ha podido actualizar, intente más tarde'});
        }
    });
}

module.exports = {
    saveEmployee,
    updateEmployee
}