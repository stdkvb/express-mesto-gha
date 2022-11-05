const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, '<2'],
      maxlength: [30, '>30'],
    },
    about: {
      type: String,
      required: true,
      minlength: [2, '<2'],
      maxlength: [30, '>30'],
    },
    avatar: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => {
          validator.isEmail(email);
        },
        message: 'Неверный формат записи email',
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
