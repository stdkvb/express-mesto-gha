const bcrypt = require('bcryptjs');
const { getJwtToken } = require('../utils/jwt');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const NonAuthorisedError = require('../errors/NonAuthorisedError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (request, response, next) => {
  User.find({})
    .then((users) => response.send(users))
    .catch(next);
};

const getUser = (request, response, next) => {
  const { userId } = request.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } response.send(user);
    })
    .catch(next);
};

const createUser = (request, response, next) => {
  const {
    name, about, avatar, email, password,
  } = request.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then(() => response.status(201).send({
          name,
          about,
          email,
          avatar,
        }))
        .catch((error) => {
          if (error.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует.'));
          } else if (error.name === 'ValidationError') {
            next(new BadRequestError('Некорректные данные при создании пользователяю'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

const updateUser = (request, response, next) => {
  const owner = request.user.id;
  const { name, about } = request.body;
  User.findByIdAndUpdate(owner, { name, about }, { runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет такого пользователя в базе.');
      }
      response.send({
        _id: owner,
        name,
        about,
        avatar: user.avatar,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при обновлении пользователя.'));
      } else {
        next(error);
      }
    });
};

const updateAvatar = (request, response, next) => {
  const owner = request.user.id;
  const { avatar } = request.body;
  User.findByIdAndUpdate(owner, { avatar }, { runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет такого пользователя в базе.');
      }
      response.send({
        _id: owner,
        name: user.name,
        about: user.about,
        avatar,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при обновлении аватара.'));
      } else {
        next(error);
      }
    });
};

const login = (request, response, next) => {
  const { email, password } = request.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NonAuthorisedError('Такого пользователя не существует.');
      }
      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            throw new NonAuthorisedError('Невереный email или пароль.');
          }
          const token = getJwtToken(user._id);
          response.cookie('jwt', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          });
          return response.send({ message: 'Аутентификация выполнена', token });
        });
    })
    .catch(next);
};

const getCurrentUser = (request, response, next) => {
  const owner = request.user.id;

  User.findById(owner)
    .then((user) => {
      response.send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getCurrentUser,
};
