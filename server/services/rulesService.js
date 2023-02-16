//const Firebird = require('node-firebird');
var firebird = require('node-firebird-dialect1');
const { options } = require('../config');

const newRuleService = async (rule) => {
  const { codigotipoenvio, codigomedioenvio, recordatorio, activo } = rule;

  const sql = `insert into INT_REGLAS (CODIGOREGLA, CODIGOTIPOENVIO, CODIGOMEDIOENVIO, RECORDATORIO, ACTIVO)
  values (gen_id(AUXILIAR,1), ${codigotipoenvio}, ${codigomedioenvio}, ${recordatorio}, ${activo})`;

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
          rule: rule,
        });
      });
    });
  });
};

const getRulesService = async () => {
  const sql = 'select * from INT_PROC_REGLAS';

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
          rules: result,
        });
      });
    });
  });
};

const updateRuleService = async (rule) => {
  const {
    CODIGOREGLA,
    codigotipoenvio,
    codigomedioenvio,
    recordatorio,
    activo,
  } = rule;

  const sql = `update INT_REGLAS set CODIGOTIPOENVIO = ${codigotipoenvio}, CODIGOMEDIOENVIO = ${codigomedioenvio}, RECORDATORIO = ${recordatorio}, ACTIVO =  ${activo} where CODIGOREGLA = ${CODIGOREGLA}`;

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
          rule: rule,
        });
      });
    });
  });
};

const updateLastSentDate = async (codigo) => {
  const sql = `update INT_REGLAS set FECHAULTIMOENVIO = current_timestamp where CODIGOREGLA = ${codigo}`;

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

module.exports = {
  newRuleService,
  getRulesService,
  updateRuleService,
  updateLastSentDate,
};
