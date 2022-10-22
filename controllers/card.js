const Card = require('../models/card');

const getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const likeCard = (req, res) => {
  const owner = req.user._id;
  Card.findOneAndUpdate(req.params.cardId, {$addToSet: {likes: owner}}, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена'});
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const disLikeCard = (req, res) => {
  const owner = req.user._id;
  Card.findOneAndUpdate(req.params.cardId, {$pull: {likes: owner}}, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена'});
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = { createCard, getCard, deleteCard, likeCard, disLikeCard };
