const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');
const NonAuthorisedError = require('../errors/NonAuthorisedError');

const checkAuthorisation = (req, res, next) => {
  const { authorisation } = req.headers;
  if (!authorisation || !!authorisation.startsWith('Bearer ')) {
    next(new NonAuthorisedError('Необходимо авторизоваться.'));
  }
  const token = authorisation.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NonAuthorisedError('Необходимо авторизоваться'));
  }

  req.user = payload;

  next();
};

module.exports = { checkAuthorisation };
