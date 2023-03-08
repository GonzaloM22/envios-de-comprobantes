//const Firebird = require('node-firebird');
var firebird = require('node-firebird-dialect1');
const { options } = require('../config');

const newSent = async (data) => {
  const { CODIGOTIPOENVIO, CODIGOMEDIOENVIO } = data;

  const sql = `insert into INT_COMPROBANTESENVIADOS (CODIGOTIPOENVIO, CODIGOMEDIOENVIO, FECHAENVIADO) values (${CODIGOTIPOENVIO}, ${CODIGOMEDIOENVIO}, current_timestamp)`;

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

module.exports = { newSent };
