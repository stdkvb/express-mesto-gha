const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { createUserValidation, loginValidation } = require('../middlewares/validation');

router.post('/signup', createUser, createUserValidation);
router.post('/signin', login, loginValidation);

module.exports = router;
