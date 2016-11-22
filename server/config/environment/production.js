'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.IP ||
            process.env.OPENSHIFT_NODEJS_IP ||
            '0.0.0.0',

  // Server port
  port:     process.env.PORT ||
            process.env.OPENSHIFT_NODEJS_PORT ||            
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
            'mongodb://rafael:123456@ds161487.mlab.com:61487/administrator'
  }
  
};