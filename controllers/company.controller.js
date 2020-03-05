'use strict'

const Company = require('../models/company');
const branchOffice = require('../models/branchOffice');
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
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
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
                            }).populate('employees').populate({path: 'products.product', model: 'product'});
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
            }).populate('employees').populate({path: 'products.product', model: 'product'});
        }
    }
    
}

function deleteCompany(req, res) {
    const companyID = req.params.id;
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        Company.findByIdAndDelete(companyID, (err, companyDeleted) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (companyDeleted) {
                res.send({'Company Deleted': companyDeleted});
            } else {
                res.status(503).send({message: 'No se pudo eliminar, intente más tarde'});
            }
        }).populate('employees').populate({path: 'products.product', model: 'product'});
    }
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
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        if (params.employee) {
            Company.findByIdAndUpdate(companyID, {$push: {employees: params.employee}}, {new: true}, (err, company) => {
                if (err) {
                    res.status(500).send({message: 'Error en la base de datos'})
                } else if (company) {
                    res.send({'Employee Added': company});
                } else {
                    res.status(503).send({message: 'No se pudo agregar al empleado, intente más tarde'});
                }
            }).populate('employees').populate({path: 'products.product', model: 'product'});
        } else {
            res.status(400).send({message: 'Ingrese un empleado'});
        }
    }
}

function removeEmployees(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        Company.findByIdAndUpdate(companyID, {$pull: {employees: params.employee}}, {new:true}, (err, company) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (company) {
                res.send({'Employee Removed': company});
            } else {
                res.status(503).send({message: 'No se pudo remover al empleado, intente más tarde'});
            }
        }).populate('employees').populate({path: 'products.product', model: 'product'});
    }
}

function listCompanies(req, res) {
    Company.find({}, (err, companies) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (companies) {
            res.send({'Companies': companies});
        } else {
            res.status(503).send({message: 'No se encontro ninguna empresa, intente más tarde'});
        }
    }).populate('employees').populate({path: 'products.product', model: 'product'});
}

//PARTE 2

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

function setBranch(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    let branch = new branchOffice();
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        if (params.name && params.direction) {
            branch.name = params.name;
            branch.direction = params.direction;
            Company.findByIdAndUpdate(companyID, {$push: {branchoffices: branch}}, {new: true}, (err, company) => {
                if (err) {
                    res.status(500).send({message: 'Error en la base de datos'})
                } else if (company) {
                    res.send({'Branch Added': company});
                } else {
                    res.status(503).send({message: 'No se pudo agregar la sucursal, intente más tarde'});
                }
            }).populate('employees').populate({path: 'products.product', model: 'product'});
        } else {
            res.status(400).send({message: 'Ingrese un nombre y una dirección de sucursal'});
        }
    }
}

function updateBranch(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    if (companyID != req.params.id) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        Company.findOneAndUpdate({_id: companyID, 'branchoffices._id': params.branch},{$set: {'branchoffices.$.name': params.name, 'branchoffices.$.direction': params.direction}}, {new: true}, (err, company) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (company) {
                res.send({'Branch Updated': company});
            } else {
                res.status(503).send({message: 'No se pudo editar la sucursal, intente más tarde'});
            }
        }).populate('employees').populate({path: 'products.product', model: 'product'});
    }
}

function removeBranch(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        if (params.branch) {
            Company.findOneAndUpdate({_id:companyID, 'branchoffices._id': params.branch}, {$pull: {branchoffices: {_id: params.branch}}}, {new: true}, (err, company) => {
                if (err) {
                    res.status(500).send({message: 'Error en la base de datos'});
                } else if (company) {
                    res.send({'Branch Removed': company});
                } else {
                    res.status(503).send({message: 'No se pudo eliminar la sucursal, intente más tarde'});
                }
            }).populate('employees').populate({path: 'products.product', model: 'product'});
        } else {
            res.status(400).send({message: 'Ingrese una sucursal'});
        }
    }
}

function listBranchs(req, res) {
    const companyID = req.params.id;
    Company.findById(companyID, (err, company) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (company) {
            res.send({'Branch Offices': company.branchoffices});
        } else {
            res.status(503).send({message: 'No se pudo listar las sucursales, intente más tarde'});
        }
    }).populate('employees').populate({path: 'products.product', model: 'product'});
}

// PRODUCTOS
//EMPRESA
function setProductCompany(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        Company.findByIdAndUpdate(companyID, {$push: {products: [{product: params.product, quantity: params.quantity}]}}, {new: true}, (err, productAdded) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (productAdded) {
                res.send({'Product Added': productAdded});
            } else {
                res.status(503).send({message: 'No se pudo agregar el producto, intente más tarde'});
            }
        }).populate('employees').populate({path: 'products.product', model: 'product'});
    }
}

function updateProductCompany(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        Company.findOneAndUpdate({_id: companyID, 'products.product': params.product}, {$set: {'products.$.quantity': params.quantity}}, {new: true}, (err, productUpdated) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos', err: err});
            } else if (productUpdated) {
                res.send({'Product Updated': productUpdated});
            } else {
                res.status(503).send({message: 'No se pudo actualizar el producto, intente más tarde'});
            }
        }).populate('employees').populate({path: 'products.product', model: 'product'});
    }
}

function removeProductCompany(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        Company.findByIdAndUpdate(companyID, {$pull: {products: {'product': params.product}}}, {new: true}, (err, productDeleted) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (productDeleted) {
                res.send({'Product Deleted': productDeleted});
            } else {
                res.status(503).send({message: 'No se pudo eliminar el producto, intente más tarde'});
            }
        }).populate('employees').populate({path: 'products.product', model: 'product'});
    }
}

function listProductsCompany(req, res) {
    const companyID = req.params.id;
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        Company.findById(companyID, (err, company) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (company) {
                res.send({'Products': company.products});
            } else {
                res.status(503).send({message: 'No se encontraron productos, intente más tarde'});
            }
        }).populate('employees').populate({path: 'products.product', model: 'product'});
    }
}

//SUCURSAL
function setProductBranch(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        Company.findOneAndUpdate({_id: companyID, 'branchoffices._id': params.branch}, {$push: {'branchoffices.$.products': [{product: params.product, quantity: params.quantity}]}}, {new: true}, (err, company) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos', err: err});
            } else if (company) {
                Company.findOneAndUpdate({_id: companyID, 'products.product': params.product}, {$inc: {'products.$.quantity': -params.quantity}}, {new: true}, (err, productUpdated) => {
                    if (err) {
                        res.status(500).send({message: 'Error en la base de datos', err: err});
                    } else if (productUpdated) {
                        res.send({'Product Added': company});
                    } else {
                        res.status(503).send({message: 'No se pudo actualizar el producto en el almacen'});
                    }
                });
            } else {
                res.status(503).send({message: 'No se pudo agregar productos a la sucursal, intente más tarde'});
            }
        }).populate('employees').populate({path: 'branchoffices.products.product', model: 'product'}).populate({path: 'products.product', model: 'product'});
    }
}

function removeProductBranch(req, res) {
    const companyID = req.params.id;
    const params = req.body;
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        Company.findOneAndUpdate({_id: companyID, 'branchoffices._id': params.branch}, {$pull: {'branchoffices.$.products': {product: params.product}}}, {new: true}, (err, company) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos', err: err});
            } else if (company) {
                res.send({'Product Removed': company});
            } else {
                res.status(503).send({message: 'No se pudo eliminar el producto de la sucursal, intente más tarde'});
            }
        });
    }
}

function stockCompany(req, res) {
    const companyID = req.params.id;
    if (companyID != req.company.sub) {
        res.status(403).send({message: 'Error de permisos, compañia no logeada'});
    } else {
        Company.aggregate({$group: {'product._id': '$products._id', 'quantity': {$sum: ['$products.quantity', '$branchoffices.products.quantity']}}}, (err, company) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos', err: err});
            } else if (company) {
                res.send({'Products': company});
            } else {
                res.status(503).send({message: 'No se pudo eliminar el producto de la sucursal, intente más tarde'});
            }
        });
    }
}

module.exports = {
    registerCompany,
    updateCompany,
    deleteCompany,
    employeesQuantity,
    setEmployees,
    removeEmployees,
    listCompanies,
    login,
    setBranch,
    updateBranch,
    removeBranch,
    listBranchs,
    setProductCompany,
    updateProductCompany,
    removeProductCompany,
    listProductsCompany,
    setProductBranch,
    removeProductBranch,
    stockCompany
}