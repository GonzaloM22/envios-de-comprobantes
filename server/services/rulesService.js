//const Firebird = require('node-firebird');
var firebird = require('node-firebird-dialect1');
const { options } = require('../config');

const newRuleService = async (rule) => {
  const { codigoregla, codigoenvio, medioenvio, recordatorio, activo } = rule;

  const sql = `insert into INT_REGLAS (CODIGOREGLA, CODIGOTIPOENVIO, CODIGOMEDIOENVIO, RECORDATORIO, ACTIVO)
  values (${codigoregla}, ${codigoenvio}, ${medioenvio}, ${recordatorio}, ${activo})`;

  return new Promise((resolve, reject) => {
    firebird.attach(options, function (err, db) {
      if (err) reject({ status: 500, msg: err });

      db.query(sql, function (err, result) {
        if (err) reject({ status: 500, msg: err });

        // IMPORTANT: close the connection
        db.detach();

        resolve({
          status: 200,
          message: 'Successful request',
          rule: rule,
        });
      });
    });
  });
};

module.exports = { newRuleService };
