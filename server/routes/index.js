const express = require('express');
const { getClients } = require('../controllers/debtsController');
const { login } = require('../controllers/usersController');
const {
  newRule,
  getRules,
  updateRule,
} = require('../controllers/rulesControlles');
const {
  newConfig,
  getConfigs,
  updateConfig,
} = require('../controllers/configController');

const router = express.Router();

router.post('/login', login);
router.get('/clients', getClients);
router.route('/rules').post(newRule).get(getRules).put(updateRule);
router.route('/config').post(newConfig).get(getConfigs).put(updateConfig);

router.get('/deudas', (req, res) => res.render('deudas'));

module.exports = router;
