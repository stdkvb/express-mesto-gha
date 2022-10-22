const Card = require('../models/card');
const { ErrorCode, NotFound, DefaultError } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(DefaultError).send({ message: 'Ошибка сервера.' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: err.message });
        return;
      }
      res.status(DefaultError).send({ message: 'Ошибка сервера.' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Переданы некорректные данные при удалении карточки' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrorCode).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.status(DefaultError).send({ message: 'Ошибка сервера.' });
    });
};

const likeCard = (req, res) => {
  const owner = req.user._id;
  Card.findOneAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true })
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrorCode).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: err.message });
      } else {
        res.status(DefaultError).send({ message: 'Ошибка сервера.' });
      }
    });
};

const disLikeCard = (req, res) => {
  const owner = req.user._id;
  Card.findOneAndUpdate(
    req.params.cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true })
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrorCode).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: err.message });
      } else {
        res.status(DefaultError).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, disLikeCard,
};
