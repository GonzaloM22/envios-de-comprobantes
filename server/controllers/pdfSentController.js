const { getSentService } = require('../services/pdfSentService');

const getSent = async (req, res) => {
  try {
    const response = await getSentService();
    return res
      .status(response.status)
      .json({ msg: response.message, data: response.data });
  } catch (error) {
    console.log(error);
    return res.status(error.status).send({ error: error.message });
  }
};

module.exports = { getSent };
