const { clientsService } = require('../services/clientsService');
const { pdfService } = require('../services/pdfService');
const {
  getRulesService,
  updateLastSentDate,
} = require('../services/rulesService');

const expression = async () => {
  try {
    const response = await getRulesService();

    response.rules.forEach(async (rule) => {
      if (
        rule.ACTIVO === 1 &&
        rule.CODIGOMEDIOENVIO === 1 &&
        rule.CANTIDADDIAS > rule.RECORDATORIO
      ) {
        const response = await clientsService(); //Traemos todas las deudas de los clientes
        const clients = response.clients;
        await pdfService(clients);
        await updateLastSentDate(rule.CODIGOREGLA);
        //console.log('Enviando...');
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { expression };
