const express = require('express');
const { getClients } = require('../controllers/debtsController');
const { login } = require('../controllers/usersController');
const {
  newRule,
  getRules,
  updateRule,
} = require('../controllers/rulesControlles');

const router = express.Router();

router.post('/login', login);
router.get('/clients', getClients);
router.route('/rules').post(newRule).get(getRules).put(updateRule);

module.exports = router;
