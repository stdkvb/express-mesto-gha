const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');
const NonAuthorisedError = require('../errors/NonAuthorisedError');

const checkAuthorisation = (request, response, next) => {
  const { authorization } = request.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NonAuthorisedError('Необходимо авторизоваться.');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    next(new NonAuthorisedError('Необходимо авторизоваться'));
  }

  request.user = payload;

  next();
};

module.exports = { checkAuthorisation };
