'use strict';

// Development Specific Configuration
// ==================================
module.exports = {
  // Server IP
  ip:       '127.0.0.1',

  // Server port
  port:     3000,
  mongo: {
    uri: 'mongodb://localhost/admin-systems'
  },
  google: {
    callbackURL:  'http://localhost:3000/auth/google/callback'
  }
};
