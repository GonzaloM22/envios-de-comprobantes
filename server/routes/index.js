const express = require('express');
const { getClients } = require('../controllers/debtsController');
const { login } = require('../controllers/usersController');
const {
  newRule,
  getRules,
  updateRule,
  deleteRule,
} = require('../controllers/rulesControlles');
const {
  newConfig,
  getConfigs,
  updateConfig,
} = require('../controllers/configController');

const router = express.Router();

router.post('/login', login);
router.get('/clients', getClients);
router
  .route('/rules')
  .post(newRule)
  .get(getRules)
  .put(updateRule)
  .delete(deleteRule);
router.route('/config').post(newConfig).get(getConfigs).put(updateConfig);

router.get('/factura', (req, res) => res.render('factura'));

module.exports = router;
