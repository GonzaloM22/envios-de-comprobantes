const { loginService } = require('../services/authService');

//import { validationResult } from 'express-validator';

const login = async (req, res) => {
  const { user, password } = req.body;

  try {
    /*const resultValidation = validationResult(req);
    const hasError = resultValidation.throw();

    if (hasError) {
      return res.status(400).send({ message: resultValidation.errors[0].msg });
    }*/

    const result = await loginService(user, password).catch((error) => error);

    return res.status(result.status).send({
      message: result.message,
      //token: result.token,
    });
  } catch (error) {
    return res.status(500).send({ message: 'request error', error });
  }
};

module.exports = { login };
