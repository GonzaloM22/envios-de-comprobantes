//const Firebird = require('node-firebird');
var firebird = require('node-firebird-dialect1');
const { options } = require('../config');

const newRuleService = async (rule) => {
  const {
    codigotipoenvio,
    codigomedioenvio,
    recordatorio,
    mensaje,
    activo,
    confirmado,
  } = rule;

  let fechaultimoenvio;
  if (confirmado) {
    fechaultimoenvio = "'01/01/1900'";
  } else {
    fechaultimoenvio = 'current_timestamp';
  }

  const sql = `insert into INT_REGLAS (CODIGOREGLA, CODIGOTIPOENVIO, CODIGOMEDIOENVIO, RECORDATORIO, MENSAJE, ACTIVO, FECHAULTIMOENVIO)
  values (gen_id(AUXILIAR,1), ${codigotipoenvio}, ${codigomedioenvio}, ${recordatorio}, ${mensaje}, ${activo}, ${fechaultimoenvio})`;

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
    mensaje,
    activo,
    confirmado,
  } = rule;

  let sql;
  let fechaultimoenvio;

  switch (confirmado) {
    case true:
      if (codigomedioenvio) {
        fechaultimoenvio = "'01/01/1900'";
        sql = `update INT_REGLAS set CODIGOTIPOENVIO = ${codigotipoenvio}, CODIGOMEDIOENVIO = ${codigomedioenvio}, RECORDATORIO = ${recordatorio}, MENSAJE = '${mensaje}', ACTIVO = ${activo}, FECHAULTIMOENVIO = ${fechaultimoenvio} where CODIGOREGLA = ${CODIGOREGLA}`;
      } else {
        fechaultimoenvio = "'01/01/1900'";
        sql = `update INT_REGLAS set FECHAULTIMOENVIO = ${fechaultimoenvio} where CODIGOREGLA = ${CODIGOREGLA}`;
      }
      break;
    default:
      sql = `update INT_REGLAS set CODIGOTIPOENVIO = ${codigotipoenvio}, CODIGOMEDIOENVIO = ${codigomedioenvio}, RECORDATORIO = ${recordatorio}, MENSAJE = '${mensaje}', ACTIVO = ${activo} where CODIGOREGLA = ${CODIGOREGLA}`;
      break;
  }

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

const updateLastSentDate = async (codigoregla, codigomedioenvio) => {
  const sql = `update INT_REGLAS set FECHAULTIMOENVIO = current_timestamp where CODIGOMEDIOENVIO = ${codigomedioenvio} and CODIGOREGLA = ${codigoregla}`;

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

const deleteRuleService = async (codigoregla) => {
  const sql = `delete from INT_REGLAS
  where CODIGOREGLA = ${codigoregla}`;

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
  deleteRuleService,
};
