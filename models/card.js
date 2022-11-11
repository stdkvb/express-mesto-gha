const mongoose = require('mongoose');

const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, '<2'],
      maxlength: [30, '>30'],
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (link) => validator.isURL(link),
        message: 'Неверный формат записи ссылки на аватар',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
