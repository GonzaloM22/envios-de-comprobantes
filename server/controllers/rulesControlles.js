const {
  newRuleService,
  getRulesService,
  updateRuleService,
} = require('../services/rulesService');

const newRule = async (req, res) => {
  try {
    const rule = req.body;

    const response = await newRuleService(rule);
    return res
      .status(response.status)
      .json({ msg: response.message, rule: response.rule });
  } catch (error) {
    return res.status(error.status).send({ error: error.message });
  }
};

const updateRule = async (req, res) => {
  try {
    const rule = req.body;

    const response = await updateRuleService(rule);

    return res
      .status(response.status)
      .json({ msg: response.message, rule: response.rule });
  } catch (error) {
    return res.status(error.status).send({ error: error.message });
  }
};

const getRules = async (req, res) => {
  try {
    const response = await getRulesService();
    return res
      .status(response.status)
      .json({ msg: response.message, rules: response.rules });
  } catch (error) {
    return res.status(error.status).send({ error: error.message });
  }
};

module.exports = { newRule, updateRule, getRules };
