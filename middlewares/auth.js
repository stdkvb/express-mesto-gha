const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');

const checkAuthorisation = (req, res, next) => {
  const { authorisation } = req.headers;
  if (!authorisation || !!authorisation.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходимо авторизоваться' });
  }
  const token = authorisation.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Необходимо авторизоваться' });
  }

  req.user = payload;

  next();
};

module.exports = { checkAuthorisation };
