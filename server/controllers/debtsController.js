const { clientsService } = require('../services/clientsService');

const getClients = async (req, res) => {
  try {
    const response = await clientsService();

    return res.status(response.status).json({ clients: response.clients });
  } catch (error) {
    return res.status(error.status).send({ error: error.message });
  }
};

module.exports = { getClients };
