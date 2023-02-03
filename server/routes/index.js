const express = require('express');
const { getClients } = require('../controllers/clientsDebts');
const { login } = require('../controllers/usersController');
const { generatePdf } = require('../controllers/pdfController.js');

const router = express.Router();

router.post('/login', login);
router.get('/clients', getClients);
router.get('/pdf', generatePdf);

module.exports = router;
