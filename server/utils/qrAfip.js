const QRCode = require('qrcode');
const { formatDate } = require('../helpers');

const generateQR = async (data) => {
  const {
    FECHACOMPROBANTE,
    CUITEMPRESA,
    NUMEROCOMPROBANTE,
    CODIGOCOMPROBANTEAFIP,
    TOTALBRUTO,
    CODIGOMONEDAAFIP,
    COTIZACION,
    CODIGOTIPOAUTORIZACION,
    CODIGODOCUMENTOAFIP,
    NUMEROCAE,
    CUITRECEPTOR,
  } = data[0];

  const VERSION = 1;
  const level = 'L';

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
    fecha: formatDate(FECHACOMPROBANTE)
      .replaceAll('/', '-')
      .split('')
      .reverse()
      .join(''),
    cuit: parseInt(CUITEMPRESA.replaceAll('-', '')),
    ptoVta,
    tipoCmp: parseInt(CODIGOCOMPROBANTEAFIP),
    nroCmp,
    importe: parseFloat(TOTALBRUTO.toFixed(2)) * 100,
    moneda: CODIGOMONEDAAFIP || 'PES',
    ctz: COTIZACION,
    tipoDocRec: Number(CODIGODOCUMENTOAFIP),
    nroDocRec: parseInt(CUITRECEPTOR.replaceAll('-', '')),
    tipoCodAut: CODIGOTIPOAUTORIZACION.trim(),
    codAut: parseInt(NUMEROCAE),
  };

  console.log(qrObject);

  const qrString = JSON.stringify(qrObject);
  const qrBase64 = btoa(qrString);
  const afipURL = 'https://www.afip.gob.ar/fe/qr/?p=' + qrBase64;

  let qr;
  try {
    qr = await QRCode.toDataURL(afipURL);
  } catch (err) {
    console.error(err);
  }
  return qr;
};

module.exports = { generateQR };
