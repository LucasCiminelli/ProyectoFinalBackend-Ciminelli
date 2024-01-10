import winston from "winston";
import dotenv from "dotenv";
dotenv.config();

const config = {
  PRODUCTION: {
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.printf(({ level, message }) => `${level}: ${message}`),
          winston.format.json()
        ),
      }),
      new winston.transports.File({
        level: "error",
        filename: "./logs/errors.log",
      }),
    ],
  },
  DEVELOPMENT: {
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.printf(({ level, message }) => `${level}: ${message}`),
          winston.format.json()
        ),
      }),
    ],
  },
};

export const logger = winston.createLogger(config[process.env.environment]);

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
