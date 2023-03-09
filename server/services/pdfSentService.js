//const Firebird = require('node-firebird');
var firebird = require('node-firebird-dialect1');
const { options } = require('../config');

const newSent = async (codigoparticular, data, sent) => {
  const { CODIGOTIPOENVIO, CODIGOMEDIOENVIO } = data;

  const sql = `insert into INT_COMPROBANTESENVIADOS (CODIGOTIPOENVIO, CODIGOMEDIOENVIO, FECHA, ENVIADO, CODIGOPARTICULAR) values (${CODIGOTIPOENVIO}, ${CODIGOMEDIOENVIO}, current_timestamp, ${sent}, ${codigoparticular})`;

  return new Promise((resolve, reject) => {
    firebird.attach(options, function (err, db) {
      if (err) reject({ status: 500, msg: err });

      db.query(sql, function (err, result) {
        if (err) reject({ status: 500, msg: err });

        // IMPORTANT: close the connection
        db.detach();

        resolve({
          status: 200,
          message: false,
        });
      });
    });
  });
};

const getSentService = async (data) => {
  const sql =
    'select T.DESCRIPCION TIPOENVIO, M.DESCRIPCION MEDIOENVIO, C.CODIGOPARTICULAR, C.FECHA, C.ENVIADO from INT_COMPROBANTESENVIADOS C inner join INT_TIPOSENVIOS T on T.CODIGOTIPOENVIO = C.CODIGOTIPOENVIO inner join INT_MEDIOSENVIOS M on M.CODIGOMEDIOENVIO = C.CODIGOMEDIOENVIO  ';

  return new Promise((resolve, reject) => {
    firebird.attach(options, function (err, db) {
      if (err) reject({ status: 500, msg: err });

      db.query(sql, function (err, result) {
        if (err) reject({ status: 500, msg: err });

        // IMPORTANT: close the connection
        db.detach();

        resolve({
          status: 200,
          message: false,
          data: result,
        });
      });
    });
  });
};

module.exports = { newSent, getSentService };
