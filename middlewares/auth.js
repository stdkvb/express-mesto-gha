const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');
const NonAuthorisedError = require('../errors/NonAuthorisedError');

const checkAuthorisation = (request, response, next) => {
  const { authorisation } = request.headers;
  if (!authorisation || !!authorisation.startsWith('Bearer ')) {
    next(new NonAuthorisedError('Необходимо авторизоваться.'));
  }
  const token = authorisation.replace('Bearer ', '');

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
