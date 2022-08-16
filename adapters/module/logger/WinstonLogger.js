const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
const winstonDaily = require('winston-daily-rotate-file');

const logDir = `${__dirname}/logs`;
module.exports = class WinstonLogger {
    constructor() {
        this.format = combine(
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            label({ label: 'admin-service' }),

            printf((info) => {
                // console.log('정보', info);
                return `<${info.label}> ${info.timestamp} - ${info.level} : ${info.message}`;
            })
        );
        this.logger = createLogger({
            format: this.format,
            transports: [
                new transports.DailyRotateFile({
                    level: 'info',
                    datePattern: 'YY-MM-DD',
                    dirname: logDir,
                    filename: `%DATE%.log`,
                    maxFiles: 30, // 최대 저장일수
                }),
                new transports.DailyRotateFile({
                    level: 'error',
                    datePattern: 'YY-MM-DD',
                    dirname: logDir + '/error',
                    filename: `%DATE%.error.log`,
                    maxFiles: 30, // 최대 저장일수
                }),
            ],
        });
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(
                new transports.Console({
                    format: combine(colorize({ all: true }), this.format),
                })
            );
        }
    }
    log(level, namespace, message, ...etc) {
        this.logger.log(level, `[${namespace}] ${message} / ${etc}`);
    }
};

// const winston = require('winston');
// const winstonDaily = require('winston-daily-rotate-file');
// const colors = require('colors');

// const logDir = 'logs';
// // const { combine, timestamp, printf } = winston.format;
// const logFormat = winston.format.printf((info) => {
//     return `${info.timestamp} ${info.level} ${info.message}`;
// });

// module.exports = class {
//     constructor() {
//         this.logger = winston.createLogger({
//             format: winston.format.combine(
//                 winston.format.timestamp({
//                     format: 'YYYY-MM-DD HH:mm:ss',
//                 }),
//                 winston.format.splat(),
//                 winston.format.colorize(),
//                 logFormat
//             ),
//             transports: [
//                 new winstonDaily({
//                     level: 'info',
//                     datePattern: 'YYYY-MM-DD',
//                     dirname: logDir,
//                     filename: `%DATE%.log`,
//                     maxFiles: 30,
//                     zippedArchive: true,
//                 }),
//                 new winstonDaily({
//                     level: 'error',
//                     datePattern: 'YYYY-MM-DD',
//                     dirname: logDir + '/error',
//                     filename: `%DATE%.error.log`,
//                     maxFiles: 30,
//                     zippedArchive: true,
//                 }),
//             ],
//         });

//         if (process.env.NODE_ENV !== 'production') {
//             this.logger.add(
//                 new winston.transports.Console({
//                     format: winston.format.combine(
//                         winston.format.colorize(),
//                         winston.format.simple()
//                     ),
//                 })
//             );
//         }
//     }

//     log(level, namespace, message, user) {
//         this.logger.log({ level: level, message: `${namespace} ${message}` });
//     }
// };
