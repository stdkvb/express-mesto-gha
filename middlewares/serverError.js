const serverError = ((error, request, response, next) => {
  const { statusCode = 500, message } = error;

  response.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });

  next();
});

module.exports = serverError;
