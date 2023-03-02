const QRCode = require('qrcode');
const { formatDate } = require('../helpers');

const generateQR = (
  FECHACOMPROBANTE,
  CUITEMPRESA,
  NUMEROCOMPROBANTE,
  CODIGOCOMPROBANTEAFIP,
  TOTALBRUTO,
  CODIGOMONEDAAFIP,
  COTIZACION,
  CODIGOTIPOAUTORIZACION,
  NUMEROCAE,
  CODIGODOCUMENTOAFIP,
  CUITRECEPTOR,
  VERSION = 1,
  level = 'L'
) => {
  let levelParameter = level.toString().toUpperCase();
  const levelsArray = ['L', 'M', 'Q', 'H'];

  if (levelsArray.includes(levelParameter)) {
    levelParameter = level.toString().toUpperCase();
  } else {
    levelParameter = 'L';
  }

  let stringNumber = NUMEROCOMPROBANTE.toString();
  while (stringNumber.length < 13) {
    stringNumber = '0' + stringNumber;
  }

  const ptoVta = parseInt(stringNumber.substring(0, 5));
  const nroCmp = parseInt(stringNumber.substring(5));

  let qrObject = {
    ver: VERSION,
    fecha: formatDate(FECHACOMPROBANTE).replaceAll('/', '-'),
    cuit: parseInt(CUITEMPRESA.replaceAll('-', '')),
    ptoVta,
    tipoCmp: parseInt(CODIGOCOMPROBANTEAFIP),
    nroCmp,
    importe: parseFloat(TOTALBRUTO.toFixed(2)) * 100,
    moneda: CODIGOMONEDAAFIP || 'PES',
    ctz: COTIZACION,
    tipoDocRec: CODIGODOCUMENTOAFIP,
    nroDocRec: parseInt(CUITRECEPTOR.replaceAll('-', '')),
    tipoCodAut: CODIGOTIPOAUTORIZACION.trim(),
    codAut: parseInt(NUMEROCAE),
  };

  return console.log(qrObject);

  const qrString = JSON.stringify(qrObject);

  QRCode.toString('I am a pony!', { type: 'terminal' }, function (err, url) {
    console.log(url);
  });
};

module.exports = { generateQR };
