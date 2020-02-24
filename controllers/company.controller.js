'use strict'

const Company = require('../models/company');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function registerCompany(req, res) {
    const params = req.body;
    const company = Company();
    if (params.name, params.password) {
        Company.findOne({name: params.name}, (err, companyFound) => {
            if (err) {
                res.status(500).send({message: 'Error en el servidor'});
            } else if (companyFound) {
                res.send({message: 'Nombre ya utilizado'});
            } else {
                company.name = params.name;
                company.direction = params.direction;
                company.phone = params.phone;
                bcrypt.hash(params.password, null, null, (err, hashPassword) => {
                    if (err) {
                        res.status(500).send({message: 'Error al encriptar'});
                    } else {
                        company.password = hashPassword;

                        company.save((err, companySaved) => {
                            if (err) {
                                res.status(500).send({message: 'Error en la base de datos'});
                            } else if (companySaved) {
                                res.send({'Company Saved': companySaved});
                            } else {
                                res.status(503).send({message: 'Compania no guardada, intente más tarde'});
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).send({message: 'Ingrese el nombre y contraseña de la empresa'});
    }
}

function updateCompany(req, res) {
    const companyID = req.params.id;
    const update = req.body;
    if (update.name) {
        Company.findOne({name: update.name}, (err, companyFound) => {
            if (err) {
                res.status(500).send({message: 'Error en el servidor'});
            } else if (companyFound) {
                res.status(400).send({message: 'Nombre ya utilizado'});
            } else if (update.password) {
                bcrypt.hash(update.password, null, null, (err, hashPassword) => {
                    if (err) {
                        res.status(500).send({message: 'Error al encriptar'});
                    } else {
                        update.password = hashPassword;
                        Company.findByIdAndUpdate(companyID, update, {new: true}, (err, companyUpdated) => {
                            if (err) {
                                res.status(500).send({message: 'Error en la base de datos'});
                            } else if (companyUpdated) {
                                res.send({'Company Updated': companyUpdated});
                            } else {
                                res.status(503).send({message: 'No se puedo actualizar, intente más tarde'});
                            }
                        }).populate('employees');
                    }
                });
            }
        });
    } else {
        Company.findByIdAndUpdate(companyID, update, {new: true}, (err, companyUpdated) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (companyUpdated) {
                res.send({'Company Updated': companyUpdated});
            } else {
                res.status(503).send({message: 'No se puedo actualizar, intente más tarde'});
            }
        }).populate('employees');
    }
}

function deleteCompany(req, res) {
    const companyID = req.params.id;
    Company.findByIdAndDelete(companyID, (err, companyDeleted) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (companyDeleted) {
            res.send({'Company Deleted': companyDeleted});
        } else {
            res.status(503).send({message: 'No se pudo eliminar, intente más tarde'});
        }
    }).populate('employees');
}

function employeesQuantity(req, res) {
    const companyID = req.params.id;
    Company.findById(companyID, (err, company) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (company) {
            res.send({Company: company.name, Employees: company.employees.length});
        } else {
            res.send({message: 'No se encontro ninguna compañia'});
        }
    });
}

function setEmployees(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    if (params.employee) {
        Company.findByIdAndUpdate(companyID, {$push: {employees: params.employee}}, {new: true}, (err, company) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'})
            } else if (company) {
                res.send({'Employee Added': company});
            } else {
                res.status(503).send({message: 'No se pudo agregar al empleado, intente más tarde'});
            }
        }).populate('employees');
    } else {
        res.status(400).send({message: 'Ingrese un empleado'});
    }
}

function removeEmployees(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    Company.findByIdAndUpdate(companyID, {$pull: {employees: params.employee}}, {new:true}, (err, company) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (company) {
            res.send({'Employee Removed': company});
        } else {
            res.status(503).send({message: 'No se pudo remover al empleado, intente más tarde'});
        }
    }).populate('employees');
}

function login(req, res) {
    const params = req.body;

    if (params.name && params.password) {
        Company.findOne({name: params.name}, (err, companyFound) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (companyFound) {
                bcrypt.compare(params.password, companyFound.password, (err, checkPassword) => {
                    if (err) {
                        res.status(500).send({message: 'Error al comparar contraseñas'});
                    } else if (checkPassword) {
                        if (params.getToken) {
                            res.send({token: jwt.createToken(companyFound)});
                        } else {
                            res.send({Company: companyFound});
                        }
                    } else {
                        res.status(503).send({message: 'Contraseña incorrecta'});
                    }
                })
            } else {
                res.status(503).send({message: 'Usuario no encontrado'});
            }
        })
    } else {
        res.status(400).send({message: 'Ingrese un usuario y contraseña'});
    }
}

module.exports = {
    registerCompany,
    updateCompany,
    deleteCompany,
    employeesQuantity,
    setEmployees,
    removeEmployees,
    login
}