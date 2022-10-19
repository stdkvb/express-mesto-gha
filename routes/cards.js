const router = require('express').Router();
const { getCard, createCard, deleteCard } = require('../controllers/card');

router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.get('/cards', getCard);

module.exports = router;
