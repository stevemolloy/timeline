const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';
require('dotenv').config();

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'timeline'
    },
    port: process.env.PORT || 3000,
    db: process.env.DBURL
  },

  test: {
    root: rootPath,
    app: {
      name: 'timeline'
    },
    port: process.env.PORT || 3000,
    db: process.env.DBURL
  },

  production: {
    root: rootPath,
    app: {
      name: 'timeline'
    },
    port: process.env.PORT || 3000,
    db: process.env.DBURL
  }
};

module.exports = config[env];
