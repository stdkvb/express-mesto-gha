const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');
const { updateUserValidation, updateAvatarValidation } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', getCurrentUser);
router.patch('/me', updateUser, updateUserValidation);
router.patch('/me/avatar', updateAvatar, updateAvatarValidation);

module.exports = router;
