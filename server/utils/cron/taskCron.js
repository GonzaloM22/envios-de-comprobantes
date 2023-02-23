const { clientsService } = require('../../services/clientsService');
const { sendWSP } = require('../sendWSP');
const { sendEmail } = require('../sendEmail');
const {
  getRulesService,
  updateLastSentDate,
} = require('../../services/rulesService');
const { getConfigsService } = require('../../services/configService');

const task = async (req, res) => {
  try {
    const response = await getRulesService(); //Consultamos las reglas creadas para recorrerlas

    response.rules.forEach(async (rule) => {
      //Envio por Whatsapp
      if (
        rule.ACTIVO === 1 &&
        rule.CODIGOMEDIOENVIO === 1 &&
        rule.CANTIDADDIAS > rule.RECORDATORIO
      ) {
        const response = await clientsService(); //Traemos todas las deudas de los clientes
        const clients = response.clients;
        await sendWSP(clients);
        await updateLastSentDate(rule.CODIGOREGLA, rule.CODIGOMEDIOENVIO);
      }
      //Envio por Email
      if (
        rule.ACTIVO === 1 &&
        rule.CODIGOMEDIOENVIO === 2 &&
        rule.CANTIDADDIAS > rule.RECORDATORIO
      ) {
        const response = await clientsService(); //Traemos todas las deudas de los clientes
        const clients = response.clients;
        const config = await getConfigsService(); //Traemos las configuraciones del Email
        const configEmail = config.configs.filter(
          (value) => value.CODIGOMEDIOENVIO === 2
        );
        await sendEmail(clients, configEmail[0], rule);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { task };
