const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const authRouter = require('./auth');
const { checkAuthorisation } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/', authRouter);
router.use(checkAuthorisation);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((request, response, next) => {
  next(new NotFoundError('Неправильный путь.'));
});

module.exports = router;
