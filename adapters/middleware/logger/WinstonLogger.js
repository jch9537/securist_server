const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const colors = require('colors');

const logDir = 'logs';
// const { combine, timestamp, printf } = winston.format;
const logFormat = winston.format.printf((info) => {
    return `${info.timestamp} ${info.level} ${info.message}`;
});

module.exports = class {
    constructor() {
        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.splat(),
                winston.format.colorize(),
                logFormat
            ),
            transports: [
                new winstonDaily({
                    level: 'info',
                    datePattern: 'YYYY-MM-DD',
                    dirname: logDir,
                    filename: `%DATE%.log`,
                    maxFiles: 30,
                    zippedArchive: true,
                }),
                new winstonDaily({
                    level: 'error',
                    datePattern: 'YYYY-MM-DD',
                    dirname: logDir + '/error',
                    filename: `%DATE%.error.log`,
                    maxFiles: 30,
                    zippedArchive: true,
                }),
            ],
        });

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                })
            );
        }
    }

    log(level, namespace, message, user) {
        this.logger.log({ level: level, message: `${namespace} ${message}` });
    }
};
