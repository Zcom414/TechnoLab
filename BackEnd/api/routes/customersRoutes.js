const express = require('express');
const router = express.Router();
const { getAllCustomers, getOneCustomers, createOneCustomers, updateOneCustomers, deleteOneCustomers, getLogin } = require('../controllers/customersControllers');

// Routes for Customers
router.get('/', getAllCustomers);
router.get('/:id', getOneCustomers);
router.get('/login', getLogin);
router.post('/register', createOneCustomers);
router.put('/:id/update', updateOneCustomers);
router.delete('/:id', deleteOneCustomers);


module.exports = router;