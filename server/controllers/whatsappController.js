const { whatsappService } = require('../services/whatsappService');

const sendMsg = async (file) => {
  try {
    const response = await whatsappService(file);
    return res.status(response.status).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    return res.status(error.status).send({ error: 'EEOROEFS' });
  }
};

module.exports = { sendMsg };
