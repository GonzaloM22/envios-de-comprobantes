const express = require('express');
const { getClients } = require('../controllers/debtsController');
const { login } = require('../controllers/usersController');
const { generatePdf } = require('../controllers/pdfController.js');
const { newRule } = require('../controllers/rulesControlles');

const router = express.Router();

router.post('/login', login);
router.get('/clients', getClients);
router.post('/rules', newRule);
router.get('/pdf', generatePdf);

module.exports = router;
