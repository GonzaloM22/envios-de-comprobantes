const express = require('express');
const { getClients } = require('../controllers/debtsController');
const { login } = require('../controllers/usersController');
const { generatePdf } = require('../controllers/pdfController.js');
const {
  newRule,
  getRules,
  updateRule,
} = require('../controllers/rulesControlles');

const router = express.Router();

router.post('/login', login);
router.get('/clients', getClients);
router.route('/rules').post(newRule).get(getRules).put(updateRule);
router.get('/pdf', generatePdf);

module.exports = router;
