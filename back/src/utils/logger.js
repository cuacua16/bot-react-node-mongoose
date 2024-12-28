import {createLogger, format, transports, addColors} from "winston"
const { combine, timestamp, label, printf, simple } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const colorsLogger = { error: 'red', warn: 'yellow', info: 'green', debug: 'cyan' };
addColors(colorsLogger);

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp({format: "YYYY-MM-DD HH:mm:ss"}), myFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ maxFiles: 5, maxsize: 5120000, filename: `logs/error.log`, level: 'error' }),
    new transports.File({ maxFiles: 5, maxsize: 5120000, filename: `logs/combined.log` }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: combine(format.colorize(), timestamp({format: "YYYY-MM-DD HH:mm:ss"}), myFormat),}));
}

export const log = (level='info', message) => {
  if (typeof message === 'object') message = JSON.stringify(message);
  logger[level](message);
}

export const resLog = (req, res, code, data) => {
  const ms = req.start ? Math.abs(req.start - new Date()) : "-";
  const logLevel = code >= 500 ? "error" : code >= 300 ? "warn" : "info";
  log(logLevel, `${code} ${ms}ms [${req.method}] ${req.originalUrl} Data: ${JSON.stringify(data)}`);
  res.status(code).json(data);
}