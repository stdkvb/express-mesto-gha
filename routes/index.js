const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFound = require('../errors/errors');

router.use(userRouter);
router.use(cardRouter);

router.use((req, res) => {
  res.status(NotFound).send({ message: 'Неправильный путь.' });
});

module.exports = router;
