import * as winston from 'winston';

import 'winston-daily-rotate-file';

const dailyRotate = (
  folder: string,
  level: string,
) => {

  return new winston.transports
    .DailyRotateFile({

      dirname: `logs/${folder}`,

      filename: `%DATE%.log`,

      datePattern: 'YYYY-MM-DD',

      zippedArchive: true,

      maxSize: '20m',

      maxFiles: '30d',

      level,

      format: winston.format.combine(

        winston.format.timestamp(),

        winston.format.json(),
      ),
    });
};

export const winstonConfig = {

  transports: [

    // CONSOLE

    new winston.transports.Console({

      format: winston.format.combine(

        winston.format.colorize(),

        winston.format.timestamp(),

        winston.format.printf(
          ({
            level,
            message,
            timestamp,
          }) => {

            return `${timestamp} ${level}: ${message}`;
          },
        ),
      ),
    }),

    // FILE LOGS

    dailyRotate('error', 'error'),

    dailyRotate('warn', 'warn'),

    dailyRotate('info', 'info'),

    dailyRotate('debug', 'debug'),
  ],
};