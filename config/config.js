const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'timeline'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/timeline-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'timeline'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/timeline-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'timeline'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/timeline-production'
  }
};

module.exports = config[env];
