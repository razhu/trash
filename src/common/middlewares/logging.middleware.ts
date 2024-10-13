import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const elapsedTime = Date.now() - startTime;

      if (statusCode >= 200 && statusCode < 300) {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${elapsedTime}ms`,
        );
      } else {
        this.logger.warn(
          `${method} ${originalUrl} ${statusCode} - ${elapsedTime}ms`,
        );
      }
    });

    next();
  }
}
