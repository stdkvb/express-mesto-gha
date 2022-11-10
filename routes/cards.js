const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, disLikeCard,
} = require('../controllers/cards');
const { createCardValidation } = require('../middlewares/validation');

router.post('/', createCard, createCardValidation);
router.delete('/:cardId', deleteCard);
router.get('/', getCards);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', disLikeCard);

module.exports = router;
