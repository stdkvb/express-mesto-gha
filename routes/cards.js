const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, disLikeCard,
} = require('../controllers/cards');
const { createCardValidation, cardIdValidation } = require('../middlewares/validation');

router.post('/', createCardValidation, createCard);
router.delete('/:cardId', cardIdValidation, deleteCard);
router.get('/', getCards);
router.put('/:cardId/likes', cardIdValidation, likeCard);
router.delete('/:cardId/likes', cardIdValidation, disLikeCard);

module.exports = router;
