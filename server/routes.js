'use strict';

var config = require('./config/environment');
var cors = require('cors');
// var authController = require(config.resources.auth + '/authController');
// var errorHandler = require(config.resources.errors + '/errorHandler');

module.exports = function (app) {

  // Add headers
  app.all('*', cors());
    // function(req, res, next) {
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header("Access-Control-Allow-Credentials", "true");
    // res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    // res.header('Access-Control-Allow-Headers', "X-ACCESS_TOKEN", "Access-Control-Allow-Origin", 
    //   "Authorization", "Origin", "x-requested-with", "Content-Type", "Content-Range", "Content-Disposition", 
    //   "Content-Description");
    // next();
  //});

  app.options('*', function (req, res, next) {
    console.log("OK");
    res.end();
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
