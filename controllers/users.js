const bcrypt = require('bcryptjs');
const { getJwtToken } = require('../utils/jwt');
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
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(ErrorCode).send({ message: err.message });
            return;
          }
          res.status(DefaultError).send({ message: 'Ошибка сервера.' });
        });
    });
};

const updateUser = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(owner, { name, about }, { runValidators: true, new: true })
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
  User.findByIdAndUpdate(owner, { avatar }, { runValidators: true, new: true })
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

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не переданы email или пароль' });
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: 'Такого пользователя не существует' });
      }
      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          return res.status(401).send({ message: 'Невереный email или пароль' });
        }
        const token = getJwtToken(user._id);
        res.cookie('jwt', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        });
        return res.status(200).send({ message: 'Аутентификация выполнена', 'token': token });
      });
    })
    .catch(() => {
      res.status(401).send({ message: 'Ошибка аутентификации' });
    });
};

const getCurrentUser = (req, res) => {
  const owner = req.user.id;

  User.findById(owner)
    .then((user) => {
      res.send(user);
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
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getCurrentUser,
};
