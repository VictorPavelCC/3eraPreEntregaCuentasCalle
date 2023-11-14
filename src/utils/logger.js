const winston = require('winston')
const  env = require('../config/config')

const customLevelOptions = {
    levels: {
      fatal: 0,
      error: 1,
      warning: 2,
      info: 3,
      http: 4,
      debug: 5,
    },
    colors: {
      fatal: "red",
      error: "orange",
      warning: "yellow",
      info: "blue",
      http: "grey",
      debug: "white",
    },
};


const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
      }),
    ],
});


const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
      }),
      new winston.transports.File({
        filename: "./logs/errors.log",
        level: "error",
        format: winston.format.simple(),
      }),
    ],
  });
  

function addLogger(req, res, next) {
    if (environmentMode == "dev") {
      req.logger = devLogger;
    } else if (environmentMode == "prod") {
      req.logger = prodLogger;
    }
  
    req.logger.http(
      `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
    );
    next();
  }

  module.exports = addLogger