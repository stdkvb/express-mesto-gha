const router = require('express').Router();
const {
  getCard, createCard, deleteCard, likeCard, disLikeCard,
} = require('../controllers/card');

router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.get('/cards', getCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', disLikeCard);

module.exports = router;
