'use strict'

module.exports = function (err, req, res, next) {
  let statusCode = err.errorCode || 500;
  let error = err.message || err;
  res.status(statusCode).send(error);
};
