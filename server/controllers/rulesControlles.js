const { newRuleService } = require('../services/rulesService');

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

module.exports = { newRule };
