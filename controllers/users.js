const User = require('../models/user');
const { ErrorCode, NotFound, DefaultError } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DefaultError).send({ message: 'Ошибка сервера.' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrorCode).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(DefaultError).send({ message: 'Ошибка сервера.' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: err.message });
        return;
      }
      res.status(DefaultError).send({ message: 'Ошибка сервера.' });
    });
};

const updateUser = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(owner, { name, about }, { runValidators: true })
    .then((user) => {
      res.send({
        _id: owner,
        name,
        about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(NotFound).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(DefaultError).send({ message: 'Ошибка сервера.' });
      }
    });
};

const updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar }, { runValidators: true })
    .then((user) => {
      res.send({
        _id: owner,
        name: user.name,
        about: user.about,
        avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(NotFound).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(DefaultError).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
