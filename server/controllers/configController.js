const {
  newConfigService,
  getConfigsService,
  updateConfigService,
} = require('../services/configService');

const newConfig = async (req, res) => {
  try {
    const rule = req.body;

    const response = await newConfigService(rule);
    return res
      .status(response.status)
      .json({ msg: response.message, rule: response.rule });
  } catch (error) {
    console.log(error);
    return res.status(error.status).send({ error: error.message });
  }
};

const getConfigs = async (req, res) => {
  try {
    const response = await getConfigsService();
    return res
      .status(response.status)
      .json({ msg: response.message, configs: response.configs });
  } catch (error) {
    console.log(error);
    return res.status(error.status).send({ error: error.message });
  }
};

const updateConfig = async (req, res) => {
  try {
    const config = req.body;

    const response = await updateConfigService(config);

    return res
      .status(response.status)
      .json({ msg: response.message, config: response.config });
  } catch (error) {
    console.log(error);
    return res.status(error.status).send({ error: error.message });
  }
};

module.exports = { newConfig, getConfigs, updateConfig };
