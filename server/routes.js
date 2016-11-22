'use strict';

var config = require('./config/environment');
// var authController = require(config.resources.auth + '/authController');
// var errorHandler = require(config.resources.errors + '/errorHandler');

module.exports = function (app) {

  // Add headers
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
  });
	
  app.use('/auth', require('./auth/authRoute'));

  // app.all('/api/*', authController.isAuthenticated);
  app.use('/api/system', require('./api/routes/systemRoute'));
  app.use('/api/user', require('./api/routes/userRoute'));

  // Tratamento dos erros
  // app.use(errorHandler);

  app.route('/*').get(function (req, res) {
    res.sendFile(app.get('appPath') + '/index.html');
  });
};
