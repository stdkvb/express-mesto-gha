const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (request, response, next) => {
  Card.find({})
    .then((cards) => response.send(cards))
    .catch(next);
};

const createCard = (request, response, next) => {
  const { name, link } = request.body;
  const owner = request.user.id;
  Card.create({ name, link, owner })
    .then((card) => response.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании карточки.'));
      } else {
        next(error);
      }
    });
};

const deleteCard = (request, response, next) => {
  const owner = request.user.id;
  const { cardId } = request.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные при удалении карточки.');
      } else if (owner.toString() !== card.owner.toString()) {
        throw new ForbiddenError('Нет прав на удаление карточки.');
      } else {
        return card.remove()
          .then(() => response.send({ message: 'Карточка удалена.' }));
      }
    })
    // eslint-disable-next-line consistent-return
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Карточка с указанным _id не найдена.'));
      }
      next(error);
    });
};

const likeCard = (request, response, next) => {
  const owner = request.user.id;
  const { cardId } = request.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные для постановки лайка.');
      } else {
        response.send(card);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий _id карточки.'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

const disLikeCard = (request, response, next) => {
  const owner = request.user.id;
  const { cardId } = request.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные для снятия лайка.');
      } else {
        response.send(card);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий _id карточки.'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, disLikeCard,
};
