const router = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);

module.exports = router;
