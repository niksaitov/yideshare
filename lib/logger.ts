import { createLogger, format, transports } from 'winston';

const globalForLogger = global as unknown as {
    logger: ReturnType<typeof createLogger> | undefined 
  };

const logger = globalForLogger.logger ?? createLogger({
  level: "degug",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} ${level}: ${message}${stack ? `\n${stack}` : ''}`;
    })
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

export default logger;