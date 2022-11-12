const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { createUserValidation, loginValidation } = require('../middlewares/validation');
const { signout } = require('../middlewares/auth');

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);
router.get('/signout', signout);

module.exports = router;
