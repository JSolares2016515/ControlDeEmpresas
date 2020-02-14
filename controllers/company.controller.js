'use strict'

const Company = require('../models/company');

function registerCompany(req, res) {
    const params = req.body;
    const company = Company();
    if (params.name) {
        Company.findOne({name: params.name}, (err, companyFound) => {
            if (err) {
                res.status(500).send({message: 'Error en el servidor'});
            } else if (companyFound) {
                res.send({message: 'Nombre ya utilizado'});
            } else {
                company.name = params.name;
                company.direction = params.direction;
                company.phone = params.phone;
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
    } else {
        res.status(400).send({message: 'Ingrese el nombre de la empresa'});
    }
}

function updateCompany(req, res) {
    const companyID = req.params.id;
    const update = req.body;
    Company.findByIdAndUpdate(companyID, update, {new: true}, (err, companyUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (companyUpdated) {
            res.send({'Company Updated': companyUpdated});
        } else {
            res.status(503).send({message: 'No se puedo actualizar, intente más tarde'});
        }
    });
}

module.exports = {
    registerCompany,
    updateCompany
}