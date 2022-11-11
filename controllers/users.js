const bcrypt = require('bcryptjs');
const { getJwtToken } = require('../utils/jwt');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const NonAuthorisedError = require('../errors/NonAuthorisedError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then(() => res.status(201).send({
          name,
          about,
          email,
          avatar,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует.'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Некорректные данные при создании пользователяю'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const owner = req.user.id;
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
        next(new BadRequestError('Некорректные данные при обновлении пользователя.'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
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
        next(new BadRequestError('Некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Не переданы email или пароль.'));
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NonAuthorisedError('Такого пользователя не существует.');
      }
      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          throw NonAuthorisedError('Невереный email или пароль.');
        }
        const token = getJwtToken(user._id);
        res.cookie('jwt', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        });
        return res.status(200).send({ message: 'Аутентификация выполнена', token });
      });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const owner = req.user.id;

  User.findById(owner)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getCurrentUser,
};
