const express = require('express');
const router = express.Router();

const invoceController = require('../controllers/invoice.controller');



router
    //region Invoice
    .get('/', invoceController.getAllInvoice)
    .post('/createInvoice', invoceController.createInvoces)
    .post('/editInvoice/:id', invoceController.editInvoiceById)
    .delete('/deleteInvoice/:id', invoceController.deleteInvoiceById)

    //endregion
    .get('/sales/:id', invoceController.getAllSales)
module.exports = router;