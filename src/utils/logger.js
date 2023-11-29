import winston from "winston";
import dotenv from "dotenv";
dotenv.config();

const config = {
  PRODUCTION: {
    transports: [
      new winston.transports.Console({
        level: "info",
      }),
      new winston.transports.File({
        filename: "/errors.log",
        level: "error",
      }),
    ],
  },
  DEVELOPMENT: {
    transports: [
      new winston.transports.Console({
        level: "debug",
      }),
    ],
  },
};

export const logger = winston.createLogger(config[process.env.environment]);

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
