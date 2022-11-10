const { celebrate, Joi } = require('celebrate');

const linkRegEx = /(http(s)?):\/\/(www.)?[a-z-\d]{1,256}.[a-z]{2,6}\b(\/[a-z]*)*/gm;

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegEx),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(linkRegEx),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(6),
    link: Joi.string().regex(linkRegEx),
  }),
});

module.exports = {
  createUserValidation,
  loginValidation,
  updateAvatarValidation,
  updateUserValidation,
  createCardValidation,
};
