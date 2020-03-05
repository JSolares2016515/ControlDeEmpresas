'use strict'

const Express = require('express');
const api = Express.Router();

const companyController = require('../controllers/company.controller');
const middlewareAuth = require('../middlewares/authenticated');

//PARTE 1

api.post('/save', companyController.registerCompany);
api.put('/update/:id', middlewareAuth.ensureAuth, companyController.updateCompany);
api.delete('/delete/:id', middlewareAuth.ensureAuth, companyController.deleteCompany);
api.get('/employeesQuantity/:id', companyController.employeesQuantity);
api.get('/list', companyController.listCompanies);

api.put('/addEmployee/:id', middlewareAuth.ensureAuth, companyController.setEmployees);
api.put('/removeEmployee/:id', middlewareAuth.ensureAuth, companyController.removeEmployees);

//PARTE 2

api.post('/login', companyController.login);

api.put('/addBranch/:id', middlewareAuth.ensureAuth, companyController.setBranch);
api.put('/updateBranch/:id', middlewareAuth.ensureAuth, companyController.updateBranch);
api.put('/removeBranch/:id', middlewareAuth.ensureAuth, companyController.removeBranch);
api.get('/listBranchs/:id', middlewareAuth.ensureAuth, companyController.listBranchs);

//PRODUCTOS-COMPAÑIA

api.put('/addProductCompany/:id', middlewareAuth.ensureAuth, companyController.setProductCompany);
api.put('/updateProductCompany/:id', middlewareAuth.ensureAuth, companyController.updateProductCompany);
api.put('/removeProductCompany/:id', middlewareAuth.ensureAuth, companyController.removeProductCompany);
api.get('/listProductsCompany/:id', middlewareAuth.ensureAuth, companyController.listProductsCompany);

//PRODUCTOS-SUCURSAL

api.put('/addProductBranch/:id', middlewareAuth.ensureAuth, companyController.setProductBranch);
api.put('/removeProductBranch/:id', middlewareAuth.ensureAuth, companyController.removeProductBranch);
api.get('/stockCompany/:id', middlewareAuth.ensureAuth, companyController.stockCompany);


module.exports = api;

//PRODUCTOS>SUCURSAL>EMPRESA
//Productos por empresa es la suma de los productos de las sucursales sucursales.