const router = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateAvatar, login,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
router.post('/auth', login);

module.exports = router;
