const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');
const { updateUserValidation, updateAvatarValidation, userIdValidation } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/:userId', userIdValidation, getUser);
router.get('/me', getCurrentUser);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
